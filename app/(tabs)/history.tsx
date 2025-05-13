import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useQrHistoryStore } from "../../store/qrHistoryStore";

export default function History() {
  const { qrHistory } = useQrHistoryStore();
  const [bookLinks, setBookLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllBookLinks = async () => {
      const newLinks: Record<string, string> = {};

      for (const item of qrHistory) {
        if (!item.isbn) continue;

        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${item.isbn}`
          );
          const result = await response.json();

          if (result.totalItems > 0) {
            const book = result.items[0];
            const bookId = book.id;
            const infoLink = `http://books.google.co.in/books?id=${bookId}`;
            newLinks[item.isbn] = infoLink;
          } else {
            newLinks[item.isbn] = "";
          }
        } catch (error) {
          newLinks[item.isbn] = "";
          console.error(`Failed to fetch book for ISBN: ${item.isbn}`, error);
        }
      }

      setBookLinks(newLinks);
    };

    if (qrHistory.length > 0) {
      fetchAllBookLinks();
    }
  }, [qrHistory]);

  const renderItem = ({ item }: any) => {
    const infoLink = bookLinks[item.isbn] || "";

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>ISBN: {item.isbn}</Text>
        <Text style={styles.detail}>Made In: {item.madeIn}</Text>
        <Text style={styles.detail}>Price: ${item.price}</Text>

        {infoLink ? (
          <>
            <View style={styles.qrContainer}>
              <QRCode value={infoLink} size={100} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(infoLink)}
            >
              <Text style={styles.buttonText}>More Info</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: "red", marginTop: 10 }}>
            Book info not found.
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR History</Text>
      <FlatList
        data={qrHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
