import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/Button';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from '@/api/products';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import RemoteImage from '@/components/RemoteImage';

export default function create() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const isUpdating = !!id;

  const { data: updatingProduct } = useProduct(+id);
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [image, setImage] = useState<string | null>(
    updatingProduct?.image || '',
  );
  const [name, setName] = useState<string>(updatingProduct?.name || '');
  const [price, setPrice] = useState<string>(
    String(updatingProduct?.price || ''),
  );
  const [errors, setErrors] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateInput = () => {
    setErrors('');

    if (!name) {
      setErrors('Name is required');
      return false;
    }

    if (!price) {
      setErrors('Price is required');
      return false;
    }

    if (isNaN(parseFloat(price))) {
      setErrors('Price is not a number');
      return false;
    }

    return true;
  };

  const onSubmit = () => (isUpdating ? onUpdate() : onCreate());

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      },
    );
  };

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }

    updateProduct(
      { id: +id, name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      },
    );
  };

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const onDelete = () => {
    deleteProduct(+id, {
      onSuccess: () => {
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Pizza' : 'Create Pizza' }}
      />

      {image?.includes('file:') ? (
        <Image
          source={{ uri: image || defaultPizzaImage }}
          style={styles.image}
        />
      ) : (
        <RemoteImage
          path={image}
          fallback={defaultPizzaImage}
          style={styles.image}
        />
      )}
      <Text
        style={styles.textButton}
        onPress={pickImage}
      >
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={{ color: 'red', marginBottom: 10 }}>{errors}</Text>

      <Button
        text={isUpdating ? 'Update' : 'Create'}
        onPress={onSubmit}
      />

      {isUpdating && (
        <Text
          style={styles.textButton}
          onPress={confirmDelete}
        >
          Delete
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});
