import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanQrCode() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: any) => {
    console.log(data, "data from barcode");
    setScanned(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${data}`
        // `https://openlibrary.org/isbn/${data}.json`
      );
      const result = await response.json();
      console.log(result, "result from api");

      if (result.totalItems > 0) {
        const book = result.items[0].volumeInfo;

        const title = book.title || "Unknown Title";
        const authors = book.authors
          ? book.authors.join(", ")
          : "Unknown Author";
        const publisher = book.publisher || "Unknown Publisher";
        const publishedDate = book.publishedDate || "Unknown Date";
        const description = book.description || "No description available.";
        const isbn10 = book.industryIdentifiers?.find(
          (id: { type: string }) => id.type === "ISBN_10"
        )?.identifier;
        const isbn13 = book.industryIdentifiers?.find(
          (id: { type: string }) => id.type === "ISBN_13"
        )?.identifier;
        const infoLink = book.infoLink;
        console.log(infoLink, "info link");

        Alert.alert(
          title,
          `✍️ Author(s): ${authors}\n🏢 Publisher: ${publisher}\n🗓️ Published: ${publishedDate}\n🔢 ISBN-10: ${isbn10}\n🔢 ISBN-13: ${isbn13}\n\n📖 ${description.substring(
            0,
            300
          )}...`,
          [
            {
              text: "More Info",
              onPress: () => Linking.openURL(infoLink),
            },
            { text: "OK", style: "cancel" },
          ]
        );
      } else {
        Alert.alert("Not Found", `No book found for code: ${data}`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch book data.");
    }

    setTimeout(() => setScanned(false), 5000);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "code128",
            "code39",
            "code93",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "pdf417",
            "itf14",
            "aztec",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
        facing={facing}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#00000088",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
