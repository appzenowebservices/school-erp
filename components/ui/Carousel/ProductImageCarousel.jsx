import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; // Import for fade effect
import "swiper/css/effect-coverflow"; // Import for coverflow effect
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from "swiper/modules";

const ProductImageCarousel = ({ selectedProduct }) => {
    console.log("selectedProduct", selectedProduct);

    return (
        <div className="">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]} 
                effect="coverflow" // Change to "fade" or "flip" for different effects
                navigation
                
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 sec
                loop={true} // Enables infinite loop
                spaceBetween={10}
                slidesPerView={1}
                coverflowEffect={{
                    rotate: 30, // Rotation angle
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                className="rounded-lg shadow-lg"
            >
                {selectedProduct?.images?.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={src}
                            alt={`Product ${index}`}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductImageCarousel;
