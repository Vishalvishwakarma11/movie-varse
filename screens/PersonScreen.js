import {
  View,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeartIcon } from "react-native-heroicons/solid";
import MovieList from "../components/movieList";
import Loading from "../components/Loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const android = Platform.OS == "android";
// const topMargin = android ? "mt-12" : "";

export default function PersonScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [isFavourate, toggleFavourate] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState([]);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    setLoading(false);
    if (data) {
      setPerson(data);
    }
  };
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    setLoading(false);
    if (data && data.cast) {  
      setPersonMovies(data.cast);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text>PersonScreen</Text>
      <SafeAreaView className="z-20 w-full flex-row justify-between items-center px-4 my-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          // style={styles.background}
          className="rounded-xl p-1"
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavourate(!isFavourate)}>
          <HeartIcon color={isFavourate ? "red" : "white"} size="35" />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: "gray",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 1,
              shadowRadius: 40,
              elevation: 100,
            }}
          >
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
              <Image
                // source={require("../assets/images/castImage2.png")}
                source={{
                  uri: image342(person?.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              />
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500  text-center">
              {person?.place_of_birth  || "N/A"}
            </Text>
          </View>
          <View className="mx-3 p-4 mt-6 flex-row justify-around  items-center bg-neutral-700 rounded-full ">
            <View className="border-r-2 border-neutral-400 px-4 items-center">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 font-semibold">
                {person?.gender == 1 ? "Female" : "Male"  || "N/A"}
              </Text>
            </View>
            <View className="border-r-2 border-neutral-400 px-4 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 font-semibold">
                {person?.birthday || "N/A"}
              </Text>
            </View>
            <View className="border-r-2 border-neutral-400 px-4 items-center">
              <Text className="text-white font-semibold">Know for</Text>
              <Text className="text-neutral-300 font-semibold">
                {person?.known_for_department  || "N/A"}
              </Text>
            </View>
            <View className=" border-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 font-semibold">
                {person?.popularity?.toFixed(2)} %
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lime-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || "N/A"}
            </Text>
          </View>
          <MovieList title={"Movies"} hideSeeAll={true} data={personMovies} />
        </View>
      )}
    </ScrollView>
  );
}
