import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// props 이름을 selectedCategories -> selectedCategory (단수)로 직관적으로 수정했습니다.
const CategoryChips = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.chipContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.chip,
            // 💡 수정 1: 스타일 이름 일치시킴 (selectedChip -> chipSelected)
            selectedCategory === category && styles.chipSelected,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          {/* 💡 수정 2: Text 컴포넌트 추가 및 텍스트 스타일 적용 */}
          <Text
            style={[
              styles.chipText,
              selectedCategory === category && styles.chipTextSelected,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff', 
    borderWidth: 1,
    borderColor: '#A6A6A6',
  },

  chipSelected: {
    backgroundColor: '#3E6AF4', 
    borderColor: '#3E6AF4',
  },

  chipText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },

  chipTextSelected: {
    color: '#ffffff', 
    fontWeight: 'bold',
  },
});

export default CategoryChips;