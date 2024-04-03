import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';
import products from 'assets/data/products';
import { defaultPizzaImage } from '@/components/ProductListItem';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();

  const product = products.find((product) => product.id.toString() === id);

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <Image
        style={styles.image}
        source={{ uri: product.image || defaultPizzaImage }}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>

    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
	title: {
    fontSize: 20,
    fontWeight: 'bold',
	},
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
