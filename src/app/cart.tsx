import { View, Text, Platform } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function Cart() {
	return (
		<View>
			<Text>Cart</Text>

			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</View>
	)
}