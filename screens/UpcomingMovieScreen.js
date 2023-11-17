import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { styles } from "../theme";
import { useNavigation } from "@react-navigation/native";
import {
  fallbackMoviePoster,
  fetchUpcomingMovies,
  image185,
} from "../api/moviedb";
import MovieList from "../components/movieList";
import { useEffect, useState } from "react";

var { width, height } = Dimensions.get("window");

export default function UpcomingMovieScreen({ title, data, hideSeeAll }) {
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    getUpcomingMovies();
  }, []);
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    // console.log("Got trending Movies: ", data);
    if (data && data.results) setUpcoming(data.results);
  };
  return (
    <View className="mb-8 space-y-4">
      <MovieList title="Upcoming" hideSeeAll={true} data={upcoming} />
    </View>
  );
}
