import { useState, useEffect } from "react";

export default function GameBanners() {
  const [buttonText, setButtonText] = useState("Tap now!");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Tap and Earn DINOH",
      buttonText: "Tap now 🦕",
      backgroundImage: "url('https://raw.githubusercontent.com/RollupRadar/project23/main/images/tappo2.svg')",
    },
    {
      title: "Play and Win a ps5",
      buttonText: "Invite",
      backgroundImage: "url('https://raw.githubusercontent.com/thedefidude18/dinohorizon/main/images/poster-battle.jpg')",
    },
    {
      title: "Dino Dash",
      buttonText: "Coming Soon",
      backgroundImage: "url('https://raw.githubusercontent.com/thedefidude18/dinohorizon/main/images/dinodashh.jpg')",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #fffff, #0ECBFF 94%)",
        fontFamily: "'ZCOOL KuaiLe', sans-serif",
        padding: "2vw",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "100%",
          padding: "2vw",
          textAlign: "center",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/thedefidude18/dinohorizon/main/images/dinomario.svg"
          alt="Dino Horizon Logo"
          style={{ width: "12vw", height: "12vw", marginRight: "2vw" }}
        />
        <h1
          style={{
            fontSize: "6vw",
            fontWeight: "bold",
            margin: 0,
            color: "#ffffff",
            fontFamily: "'ZCOOL KuaiLe', sans-serif",
          }}
        >
          Welcome to Dino Horizon.
        </h1>
      </div>

      {/* Upper Banner with Slider */}
      <div
        style={{
          width: "94vw",
          height: "75vh",
          backgroundImage: slides[currentSlide].backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "5vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          color: "#ffffff",
          position: "relative",
          marginBottom: "0.8vh", // Reduced space between banners
          padding: "1vw",
        }}
      >
        
          <button
            onClick={() => setButtonText("Loading...")}
            style={{
              padding: "2vw 5vw",
              background: "linear-gradient(to bottom, #FCD113, #F6BA06)",
              color: "#000",
              borderRadius: "2vw",
              fontSize: "4vw",
              fontWeight: "bold",
              border: "none",
              marginLeft: "2vw",
              fontFamily: "'ZCOOL KuaiLe', sans-serif",
            }}
          >
            {slides[currentSlide].buttonText}
          </button>
        </div>

        {/* Dots for Slide Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2vw",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "2vw",
          }}
        >
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)} // Allow clicking dots to change slide
              style={{
                width: index === currentSlide ? "3vw" : "2vw",
                height: index === currentSlide ? "3vw" : "2vw",
                backgroundColor: index === currentSlide ? "#ffffff" : "#cccccc",
                borderRadius: "50%",
                transition: "width 0.3s, height 0.3s, background-color 0.3s",
                cursor: "pointer",
              }}
            ></div>
          ))}
        </div>
      </div>
      
   
  );
}

