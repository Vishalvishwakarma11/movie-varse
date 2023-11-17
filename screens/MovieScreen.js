import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/Cast";
import MovieList from "../components/movieList";
import Loading from "../components/Loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const android = Platform.OS == "android";
// const topMargin = android ? "mt-12" : "";

export default function MovieScreen() {

  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [cast, setCast] = useState([]);
  const [isFavourate, toggleFavourate] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    setLoading(true);
    getMovieDetials(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMovieDetials = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
    setLoading(false);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setSimilarMovies(data.results);
    setLoading(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* back button and movie poster */}
      <View className="w-full">
        <SafeAreaView className="absolute z-20 w-full flex-row justify-between items-center px-4 pt-12">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            // style={styles.background}
            className="rounded-xl p-1"
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourate(!isFavourate)}>
            <HeartIcon
              color={isFavourate ? theme.background : "white"}
              size="35"
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: image500(movie.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(23, 23, 23, 0.8)",
                "rgba(23, 23, 23, 2)",
              ]}
              style={{
                width,
                height: height * 0.4,
                position: "absolute",
                bottom: 0,
              }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>
      {/* movie details */}
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        {/* title */}
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie?.title}
        </Text>
        {/* status, relese, runtime */}
        {movie?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {movie?.status} • {movie?.release_date?.split("-")[0]} •{" "}
            {movie?.runtime} min
          </Text>
        ) : null}

        {/* genres */}
        <View className="flex-row justify-center mx-4 space-x-2">
          {movie?.genres?.map((genre, index) => {
            let showDot = index + 1 != movie.genres.length;
            return (
              <Text
                key={index}
                className="text-neutral-400 font-semibold text-base text-center"
              >
                {genre?.name} {showDot ? " •" : null}
              </Text>
            );
          })}
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {movie?.overview}
        </Text>
        {/* cast */}
        {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}

        {/* similar movies */}
        {similarMovies.length > 0 && (
          <MovieList
            title="Similar Movies"
            hideSeeAll={true}
            data={similarMovies}
          />
        )}
      </View>
    </ScrollView>
  );
}
