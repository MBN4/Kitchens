import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES } from '../../constants/theme';
import { Camera, ChevronLeft, Tag, DollarSign, AlignLeft } from 'lucide-react-native';

export default function AddFoodItem({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.darkHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Dish</Text>
        <Text style={styles.headerSubtitle}>Add a masterpiece to your menu</Text>
      </View>

      <View style={styles.whiteSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.cameraCircle}>
                  <Camera color={COLORS.primary} size={30} />
                </View>
                <Text style={styles.uploadText}>Upload Food Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <View style={styles.inputBox}>
              <UtensilsIcon color={COLORS.primary} size={20} />
              <TextInput style={styles.input} placeholder="Dish Name" placeholderTextColor={COLORS.gray} />
            </View>

            <View style={styles.inputBox}>
              <Tag color={COLORS.primary} size={20} />
              <TextInput style={styles.input} placeholder="Category (e.g. Dessert, Italian)" placeholderTextColor={COLORS.gray} />
            </View>

            <View style={styles.inputBox}>
              <DollarSign color={COLORS.primary} size={20} />
              <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" placeholderTextColor={COLORS.gray} />
            </View>

            <View style={[styles.inputBox, { height: 120, alignItems: 'flex-start', paddingTop: 15 }]}>
              <AlignLeft color={COLORS.primary} size={20} />
              <TextInput 
                style={[styles.input, { textAlignVertical: 'top' }]} 
                placeholder="Description" 
                multiline 
                placeholderTextColor={COLORS.gray} 
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Publish Dish</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const UtensilsIcon = ({ color, size }) => (
  <View style={{ width: size, height: size, backgroundColor: color + '20', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: '22%', justifyContent: 'center', paddingHorizontal: 30, paddingTop: 30 },
  backBtn: { marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 14, color: COLORS.white, opacity: 0.7 },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 30 },
  imageUpload: { height: 200, backgroundColor: COLORS.surface, borderRadius: 35, marginBottom: 25, overflow: 'hidden', borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd' },
  uploadPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.secondary + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  uploadText: { fontWeight: 'bold', color: COLORS.primary },
  previewImage: { width: '100%', height: '100%' },
  inputGroup: { marginBottom: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 25, paddingHorizontal: 20, height: 60, marginBottom: 15, elevation: 1 },
  input: { flex: 1, marginLeft: 15, color: COLORS.primary, fontWeight: '500' },
  submitBtn: { backgroundColor: COLORS.secondary, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 40, elevation: 4 },
  submitBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 }
});