import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../assets/color/color";
import { fontStyle } from "../assets/font/font";
import { RenderItemComponent } from "../components/findChallenge/teamList";
import { fetchTeamData } from "../data/team/getAllTeam";
import { ITeams } from "../data/team/teamData";

type RootStackParamList = {
  FindChallenge: undefined;
  ChallengeDetail: { teamName: string };
};

export function FindChallenge() {
  const [teamList, setTeamList] = useState([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchTeamData();
      if (data) setTeamList(data);
    };

    loadUserData();
  }, []);

  const renderItem: React.FC<{ item: ITeams }> = ({ item }) => (
    <RenderItemComponent
      item={item}
      onPress={() =>
        navigation.navigate("ChallengeDetail", { teamName: item.teamName })
      }
    />
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.Wrapper}>
        <Text style={fontStyle.BD20}>챌린지 찾기</Text>
      </View>
      <FlatList
        data={teamList}
        renderItem={renderItem}
        keyExtractor={(item) => item.teamName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,

    backgroundColor: Colors.basic.white,
  },
  Wrapper: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
  },
});
