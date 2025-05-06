import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const Error: React.FC<ErrorModalProps> = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="items-center justify-center flex-1 px-8 bg-black/40">
        <View className="items-center w-full p-6 bg-white shadow-md rounded-xl">
          <MaterialIcons name="error-outline" size={36} color="#E53935" />
          <Text className="mt-4 mb-2 text-lg text-center text-red-600 font-poppinsSemiBold">
            Terjadi Kesalahan
          </Text>
          <Text className="mb-4 text-center text-gray-700 font-poppins">
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="px-5 py-2 bg-[##E53935] rounded-md"
          >
            <Text className="text-white font-poppinsSemiBold">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Error;