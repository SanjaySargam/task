import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';

const API_URL = 'http://13.233.95.158:5000/api_get_my_events/-1';
const PAGE_SIZE = 4; 

interface Event {
  _id: string;
  event_name: string;
  event_image: string;
  description: string;
  event_type: string;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get(`${API_URL}?page=${page}&limit=${PAGE_SIZE}`, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDg5NzM1NjQyYjQwZjcwYjU4YjQ0MWYiLCJpYXQiOjE2OTE3NDA1NzYsImV4cCI6MTY5MzkwMDU3Nn0._Rrl8lEJgaBE29qvOZubRRqu3_VY7tHnGQjFYqX2fJg',
      },
    })
    .then(response => {
      setEvents(prevEvents => [...prevEvents, ...response.data.data]);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const handleLoadMore = () => {
    if (page < 1) {
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
      fetchEvents();
    } else {
      setIsLoading(false);
    }

  };

  const renderItem = ({ item }: { item: Event }) => (
    <ListItem style={styles.list}>
      <Image
        source={{ uri: 'https://st3.depositphotos.com/1017228/18878/i/450/depositphotos_188781580-stock-photo-handsome-cheerful-young-man-standing.jpg' }}
        style={{ width: 50, height: 50 ,borderRadius:30}}
      />
      <ListItem.Content>
        <ListItem.Title>{item.event_name}</ListItem.Title>
        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        <ListItem.Subtitle style={{ color: item.event_type === 'Online' ? 'green' : 'red' }}>
          {item.event_type}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1} // Adjust this threshold as needed
      />
      {isLoading && <Text>Loading...</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  list:{
    alignContent:'center',
    flex:1,
    justifyContent:'center',
    padding:30,
    borderRadius:30,
    color:'white',
    height:200
  },
  container:{
    flex:1
  }
})
export default App;
