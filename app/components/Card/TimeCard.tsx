import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground } from "react-native";

const TimeCard = () => {
  const [time, setTime] = useState<string>("");
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: "long" };
      setDay(now.toLocaleDateString("id-ID", options));

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="items-center ">
      <ImageBackground
        source={require("../../../assets/images/mesjid.png")}
        resizeMode="cover"
        className="w-11/12 h-48 overflow-hidden rounded-2xl"
      >
        <View className="flex items-center justify-center w-full h-full px-4 bg-black/10">
          <Text className="text-lg text-white font-poppins ">{day}</Text>
          <Text className="my-4 text-4xl text-white font-poppinsBold">
            {time}
          </Text>
          <Text className="text-base text-white font-poppins">
            Jangan lupa berdzikir hari ini
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default TimeCard;
