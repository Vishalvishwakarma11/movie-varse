import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../api/moviedb";
// import DrawerNavigation from "../navigation/drawerNavigation";

const android = Platform.OS == "android";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    // console.log("Got trending Movies: ", data);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    // console.log("Got trending Movies: ", data);
    if (data && data.results) setUpcoming(data.results);
    setLoading(false);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    // console.log("Got trending Movies: ", data);
    if (data && data.results) setTopRated(data.results);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-neutral-800">
      {/* Searchbar and logo  */}
      <SafeAreaView className={android ? "pt-12" : "-mb-2"}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white">
          </Bars3CenterLeftIcon>
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {/* Trending movies carousel */}
          {trending.length > 0 && <TrendingMovies data={trending} />}

          {/* Upcoming Movies */}
          <MovieList title="Upcoming" data={upcoming} />

          {/* Top Rated Movies */}
          <MovieList title="Top Rated" data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
