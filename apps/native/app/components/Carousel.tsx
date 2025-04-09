import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { View, Dimensions, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

export interface CarouselPage {
  component: React.ComponentType<{ onNext: () => void; isActive?: boolean }>;
  props?: Record<string, any>;
}

interface CarouselProps {
  pages: CarouselPage[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onFinish: () => void;
}

export interface CarouselElement {
  goBack: () => void;
  goNext: () => void;
  getCurrentPage: () => number;
}

const Carousel = forwardRef<CarouselElement, CarouselProps>(
  ({ pages, currentPage, setCurrentPage, onFinish }, ref) => {
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToPage = (pageIndex: number) => {
      if (pageIndex === pages.length) {
        onFinish?.();
      } else {
        scrollViewRef.current?.scrollTo({
          x: pageIndex * width,
          animated: true,
        });
        setCurrentPage(pageIndex);
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToPage,
      getCurrentPage: () => currentPage,
      goBack: () => {
        scrollToPage(currentPage - 1);
      },
      goNext: () => {
        if (currentPage === pages.length - 1) {
          onFinish?.();
        } else {
          scrollToPage(currentPage + 1);
        }
      },
    }));

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        {pages.map((page, index) => (
          <View key={index} style={{ width }}>
            <page.component
              onNext={() => {
                scrollToPage(index + 1);
              }}
              isActive={currentPage === index}
              {...page.props}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
);

Carousel.displayName = "Carousel";

export default Carousel;
