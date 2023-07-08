import React, { useState, useEffect } from 'react';
import { Image, Box, Button, Select, Flex, SimpleGrid, Text, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, useToast, Spinner } from '@chakra-ui/react';

import { Buffer } from 'buffer';



const Data = () => {
    const toast = useToast();
    const [cars, setCars] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCar, setSelectedCar] = useState(null);
    const [newCar, setNewCar] = useState({
        image: '',
        make: '',
        model: '',
        year: '',
        listPrice: '',
        colors: '',
        mileage: '',
        power: '',
        maxSpeed: '',
    });
    const [searchMake, setSearchMake] = useState('');
    const [sortByPrice, setSortByPrice] = useState('');
    const [sortByColor, setSortByColor] = useState('');
    const [sortByMileage, setSortByMileage] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedFile, setSelectedFile] = useState(null);



    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/cars');
            const data = await response.json();
            setCars(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateItem = () => {
        onOpen();
    };

    const handleSaveItem = async () => {
        try {
            const imageFile = document.querySelector('input[type=file]').files[0];
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64Image = reader.result;
                const carDetails = {
                    ...newCar,
                    image: base64Image,
                };

                console.log("Car Details:", carDetails);

                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('make', newCar.make); // Include make property
                formData.append('model', newCar.model);
                formData.append('year', newCar.year);
                formData.append('listPrice', newCar.listPrice);
                formData.append('colors', newCar.colors);
                formData.append('mileage', newCar.mileage);
                formData.append('power', newCar.power);
                formData.append('maxSpeed', newCar.maxSpeed);

                const response = await fetch('http://localhost:4000/api/add-car', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                    toast({
                        title: 'Data Added Successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    setCars([...cars, data]);
                    onClose();
                    window.location.reload();
                } else {
                    console.error('Error creating car:', data);
                }
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
            }
        } catch (error) {
            console.error('Error creating car:', error);
        }
    };

    const handleUpdateCar = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/cars/${selectedCar._id}`, {
            method: 'PUT',
            body: JSON.stringify(newCar),
          });
      
          if (response.ok) {
            const updatedCar = await response.json();
            const updatedCars = cars.map((car) => (car._id === selectedCar._id ? updatedCar : car));
            setCars(updatedCars);
            console.log(updatedCars);
            onClose();
            toast({
              title: 'Updated Successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          } else {
            const errorData = await response.json();
            console.error('Error updating car:', errorData);
          }
        } catch (error) {
          console.error('Error updating car:', error);
        }
      };
      
    const handleDeleteCar = (id) => {
        fetch(`http://localhost:4000/api/cars/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Car deleted successfully') {
                    const updatedCars = cars.filter((car) => car._id !== id);
                    setCars(updatedCars);
                    toast({
                        title: 'Deleted Successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    console.error('Error deleting car:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error deleting car:', error);
            });
    };


    const handleEditCar = (carId) => {
        const car = cars.find((car) => car._id === carId);
        setSelectedCar(car);
        setNewCar({
            image: car.image,
            make: car.make,
            model: car.model,
            year: car.year,
            listPrice: car.listPrice,
            colors: car.colors,
            mileage: car.mileage,
            power: car.power,
            maxSpeed: car.maxSpeed,
        });
        onOpen();
    };


    const filteredAndSortedCars = cars
        .filter((car) => (car.make ?? '').toLowerCase().includes(searchMake.toLowerCase()))
        .sort((a, b) => {
            // Sort by price
            if (sortByPrice === 'lowToHigh') {
                return a.listPrice - b.listPrice;
            } else if (sortByPrice === 'highToLow') {
                return b.listPrice - a.listPrice;
            }
            // Sort by mileage
            if (sortByMileage === 'lowToHigh') {
                return a.mileage - b.mileage;
            } else if (sortByMileage === 'highToLow') {
                return b.mileage - a.mileage;
            }
            // Default sorting by make
            return (a.make ?? '').localeCompare(b.make ?? '');
        })
        .filter((car) => {
            // Filter by color
            if (sortByColor === '') {
                return true;
            }
            return car.colors.includes(sortByColor);
        });



    return (
        <>
            <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mt="-95vh" mr="40%" pl="20">
                <Text fontSize="xl" fontWeight="bold" color="blue.800" mr={4}>
                    BUYC Cars
                </Text>
                <Input
                    placeholder="Search"
                    value={searchMake}
                    onChange={(e) => setSearchMake(e.target.value)}
                    maxWidth="200px"
                    border={"1px"}
                />
                <Select
                    value={sortByPrice}
                    onChange={(e) => setSortByPrice(e.target.value)}
                    maxWidth="100px"
                    border={"1px"}
                    mr={4}
                    ml={4}

                >
                    <option value="">Price</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </Select>
                <Select
                    value={sortByColor}
                    onChange={(e) => setSortByColor(e.target.value)}
                    maxWidth="100px"
                    border={"1px"}
                    mr={4}
                    ml={4}
                >
                    <option value="">Colors</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                </Select>
                <Select
                    value={sortByMileage}
                    onChange={(e) => setSortByMileage(e.target.value)}
                    maxWidth="120px"
                    border={"1px"}
                    mr={4}
                    ml={4}
                >
                    <option value="">Mileage</option>
                    <option value="lowToHigh">Mileage: Low to High</option>
                    <option value="highToLow">Mileage: High to Low</option>
                </Select>

            </Box>

            <Box p={4} mt="20" mr="0%">
                <Flex justify="space-around" mb={4}>
                    <Button onClick={fetchData}>All Cars</Button>
                    <Button onClick={handleCreateItem}>Create Item</Button>
                </Flex>

                {loading ? ( // Show spinner if loading is true
                    <Flex justify="center" align="center" height="500px">
                        <Spinner thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl' />
                    </Flex>
                ) : (
                    <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                        {filteredAndSortedCars.map((car, index) => (
                            <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                {car.image && (
                                    <Image
                                        src={`data:${car.image.contentType};base64,${Buffer.from(car.image.data).toString('base64')}`}
                                        alt="Car Image"
                                        width='100%'
                                        height='40%'
                                    />
                                )}
                                <Text fontWeight="bold">Make: {car.make}</Text>
                                <Text>Model: {car.model}</Text>
                                <Text>Year: {car.year}</Text>
                                <Text>Price: {car.listPrice}</Text>
                                <Text>Color: {car.colors}</Text>
                                <Text>Mileage: {car.mileage}</Text>
                                <Text>Power: {car.power}</Text>
                                <Text>Max Speed: {car.maxSpeed}</Text>
                                <Flex justify="space-between" mt={4}>
                                    <Button colorScheme="blue" size="sm" onClick={() => handleEditCar(car._id)}>
                                        Edit
                                    </Button>
                                    <Button colorScheme="red" size="sm" onClick={() => handleDeleteCar(car._id)}>
                                        Delete
                                    </Button>
                                </Flex>
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
                {/* </Box> */}

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedCar ? 'Update Car' : 'Create Car'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input
                                placeholder="Upload Image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <Input placeholder="Make" value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} />
                            <Input placeholder="Model" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} />
                            <Input placeholder="Year" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} />
                            <Input placeholder="List Price" value={newCar.listPrice} onChange={(e) => setNewCar({ ...newCar, listPrice: e.target.value })} />
                            <Input placeholder="Color" value={newCar.colors} onChange={(e) => setNewCar({ ...newCar, colors: e.target.value })} />
                            <Input placeholder="Mileage" value={newCar.mileage} onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })} />
                            <Input placeholder="Power" value={newCar.power} onChange={(e) => setNewCar({ ...newCar, power: e.target.value })} />
                            <Input placeholder="Max Speed" value={newCar.maxSpeed} onChange={(e) => setNewCar({ ...newCar, maxSpeed: e.target.value })} />
                        </ModalBody>
                        <ModalFooter>
                            {selectedCar ? (
                                <Button colorScheme="blue" mr={3} onClick={handleUpdateCar}>
                                    Update
                                </Button>
                            ) : (
                                <Button colorScheme="blue" mr={3} onClick={handleSaveItem}>
                                    Save
                                </Button>
                            )}
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    );
};

export default Data;