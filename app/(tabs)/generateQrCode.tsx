import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useQrHistoryStore } from "../../store/qrHistoryStore";

export default function BookQrGenerator() {
  const { addQrToHistory } = useQrHistoryStore();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [madeIn, setMadeIn] = useState("");
  const [isbn, setIsbn] = useState("");
  const [qrData, setQrData] = useState("");

  const handleGenerate = () => {
    const bookDetails = {
      title,
      author,
      price,
      madeIn,
      isbn,
    };
    setQrData(JSON.stringify(bookDetails));
    addQrToHistory(bookDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Enter Book Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Made In"
        value={madeIn}
        onChangeText={setMadeIn}
      />
      <TextInput
        style={styles.input}
        placeholder="ISBN"
        value={isbn}
        onChangeText={setIsbn}
      />

      <Button title="Generate QR Code" onPress={handleGenerate} />

      {qrData !== "" && (
        <View style={styles.qrContainer}>
          <QRCode value={qrData} size={200} />
          <Text style={styles.qrText}>QR for book: {title}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  qrText: {
    marginTop: 10,
    fontSize: 14,
  },
});
