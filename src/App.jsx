import { useEffect, useMemo, useState } from "react";
import "./styles.css";

/* =========================================
   WEDDING DETAILS
========================================= */

const COUPLE = {
  groom: "Sudhakar",
  bride: "Gayatri",
  groomTa: "சுதாகர்",
  brideTa: "காயத்ரி",
};

const WEDDING_TIME = new Date("2026-12-10T05:00:00+05:30");

const EVENTS = [
  {
    icon: "💍",
    title: "Engagement",
    date: "Sunday, 25 October 2026",
    time: "10:00 AM onwards",
    place: "Sakthi Nagar, Ondipudur, Coimbatore",
    map: "https://maps.app.goo.gl/fSo6V33eWN8MEe787",
    status: "completed",
  },
  {
    icon: "🛕",
    title: "Wedding - Temple",
    date: "Thursday, 10 December 2026",
    time: "5:00 AM – 5:45 AM",
    place: "Sri Jaganatha Perumal ThiruKovil, Coimbatore",
    map: "https://www.google.com/maps/search/?api=1&query=Sri+Jaganatha+Perumal+Thirukovil+Coimbatore",
  },
  {
    icon: "💐",
    title: "Wedding - Hall",
    date: "Thursday, 10 December 2026",
    time: "6:00 AM – 10:00 AM",
    place: "Shree Aksshayam, Peelamedu, Coimbatore",
    map: "https://www.google.com/maps/search/?api=1&query=Shree+Aksshayam+Peelamedu+Coimbatore",
  },
  {
    icon: "🎉",
    title: "Reception",
    date: "Thursday, 10 December 2026",
    time: "6:30 PM onwards",
    place: "Raj Mahal, Kovilpatti, Tamil Nadu",
    map: "https://maps.app.goo.gl/BK7i4uw9iXhiyJYx5",
  },
];

const GALLERY_IMAGES = [
  "Sudhakar-Gayatri.png",
  "myfamily.jpeg",
  "Gayatrifamily.jpeg",
  "myfamily2.jpeg",
  "Gayatriunclefamily.jpeg",
  "myfamily3.jpeg",
  "Gayatrifrd.jpeg",
  "myfamily4.jpeg",
];

/* =========================================
   COUNTDOWN
========================================= */

function useCountdown(target) {
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft(target - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const seconds = Math.max(0, Math.floor(left / 1000));

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    mins: Math.floor((seconds % 3600) / 60),
    secs: seconds % 60,
  };
}

/* =========================================
   SCROLL REVEAL
========================================= */

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

/* =========================================
   FLOWER ANIMATION
========================================= */

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: Math.random() * 100,
        size: 12 + Math.random() * 12,
        duration: 10 + Math.random() * 10,
        delay: -Math.random() * 15,
        symbol: ["🌸", "🌼", "🌺"][i % 3],
      })),
    [],
  );

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={index}
          style={{
            left: `${petal.left}%`,
            fontSize: `${petal.size}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          {petal.symbol}
        </span>
      ))}
    </div>
  );
}

/* =========================================
   BRIDE / GROOM PHOTO
========================================= */

function Person({ img, name, side }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section
      id={side === "bride" ? "bride" : "groom"}
      className={`portrait-section ${side}-section`}
    >
      <div className="portrait-background">
        <img src={img} alt="" aria-hidden="true" />
      </div>

      <div className="portrait-frame">
        <div className="portrait-stage">
          {!imageFailed ? (
            <img
              className={`portrait-image ${imageLoaded ? "loaded" : ""}`}
              src={img}
              alt={`${name} wedding portrait`}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="portrait-placeholder">
              <span>🌸</span>
              <p>Photo unavailable</p>
            </div>
          )}

          <div className="portrait-shine" />
          <div className="portrait-corner corner-top-left" />
          <div className="portrait-corner corner-top-right" />
          <div className="portrait-corner corner-bottom-left" />
          <div className="portrait-corner corner-bottom-right" />
        </div>
      </div>
    </section>
  );
}


/* =========================================
   3D WEDDING GALLERY SLIDER
========================================= */



function Gallery3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalImages = GALLERY_IMAGES.length;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalImages);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, totalImages]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const getOffset = (index) => {
    let offset = index - activeIndex;

    if (offset > totalImages / 2) offset -= totalImages;
    if (offset < -totalImages / 2) offset += totalImages;

    return offset;
  };

  return (
    <section className="gallery-section">
      <div className="gallery-heading reveal">
        <span className="gallery-subtitle">
          OUR BEAUTIFUL MOMENTS
        </span>

        <h2>Our Family Gallery</h2>

        <p>Beautiful memories with our loved ones.</p>

        <span className="gallery-heart">♡</span>
      </div>

      <div
        className="gallery-3d"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {GALLERY_IMAGES.map((image, index) => {
          const offset = getOffset(index);
          const distance = Math.abs(offset);
          const isActive = offset === 0;

          return (
            <div
              key={image}
              className={`gallery-card ${isActive ? "active" : ""}`}
              style={{
                transform: `
                  translateX(calc(-50% + ${offset * 78}%))
                  translateY(-50%)
                  translateZ(${-distance * 100}px)
                  rotateY(${-offset * 20}deg)
                  scale(${isActive ? 1 : Math.max(0.72, 1 - distance * 0.1)})
                `,
                opacity: distance > 2 ? 0 : 1 - distance * 0.18,
                zIndex: 20 - distance,
                pointerEvents: distance > 2 ? "none" : "auto",
              }}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={`/gallery/${image}`}
                alt={`Family wedding memory ${index + 1}`}
                loading="lazy"
                draggable="false"
              />

              {isActive && (
                <div className="gallery-photo-label">
                  <span>♥</span>
                  Our Beautiful Family
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="gallery-controls">
        <button onClick={prevSlide} aria-label="Previous photo">
          ❮
        </button>

        <span className="gallery-counter">
          {String(activeIndex + 1).padStart(2, "0")}
          {" / "}
          {String(totalImages).padStart(2, "0")}
        </span>

        <button onClick={nextSlide} aria-label="Next photo">
          ❯
        </button>
      </div>

      <div className="gallery-dots">
        {GALLERY_IMAGES.map((image, index) => (
          <button
            key={image}
            className={activeIndex === index ? "active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>

      <p className="gallery-auto-text">
        {isPaused
          ? "Ⅱ Paused"
          : "♥ Automatically showing our memories"}
      </p>
    </section>
  );
}



/* =========================================
   EVENT CARD
========================================= */

function EventCard({ event }) {
  return (
    <article className="event-card reveal">
      {event.status === "completed" && (
        <span className="event-status">✓ Completed</span>
      )}
      <div className="event-icon">{event.icon}</div>

      <h3>{event.title}</h3>

      <p className="event-date">{event.date}</p>

      <p className="event-time">{event.time}</p>

      <p className="event-place">{event.place}</p>

      <a
        href={event.map}
        target="_blank"
        rel="noreferrer"
        className="map-button"
      >
        View Location ↗
      </a>
    </article>
  );
}

/* =========================================
   MAIN APP
========================================= */

export default function App() {
  const countdown = useCountdown(WEDDING_TIME.getTime());

  useReveal();

  return (
    <main className="wedding-app">
      <Petals />

      {/* 1. WELCOME */}

      <section className="welcome-section">
        <img
          className="welcome-image"
          src="/temple-murugan.jpg"
          alt="Temple and Lord Murugan"
          fetchPriority="high"
        />

        <div className="welcome-overlay">
          <p className="welcome-blessing">With the blessings of God</p>

          <div className="welcome-symbol">ॐ</div>

          <h1 className="script shimmer">
            {COUPLE.groom} <span>&amp;</span> {COUPLE.bride}
          </h1>

          <p className="ta-name">
            {COUPLE.groomTa} &amp; {COUPLE.brideTa}
          </p>

          <div className="gold-divider">✦</div>

          <p className="welcome-date">10 • 12 • 2026</p>

          <a href="#bride" className="scroll-button">
            Meet the Couple ↓
          </a>
        </div>
      </section>

      {/* 2. BRIDE PHOTO */}

      <Person side="bride" img="/gayatri.png" name={COUPLE.bride} />

      {/* 3. GROOM PHOTO */}

      <Person side="groom" img="/Sudhakar.jpg" name={COUPLE.groom} />

      {/* 4. WEDDING EVENTS */}

      <section className="section events-section">
        <p className="eyebrow reveal">Save the dates</p>

        <h2 className="script reveal">Wedding Events</h2>

        <p className="section-description reveal">
          Two hearts, one beautiful journey.
        </p>

        <div className="event-grid">
          {EVENTS.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </section>

      {/* 5. 3D WEDDING GALLERY */}

      <Gallery3D />

      {/* 6. COUNTDOWN */}

      <section className="countdown-section">
        <p className="eyebrow reveal">The big day is approaching</p>

        <h2 className="script reveal">Counting Down to Our Wedding</h2>

        <div className="countdown-grid reveal">
          {[
            ["Days", countdown.days],
            ["Hours", countdown.hours],
            ["Minutes", countdown.mins],
            ["Seconds", countdown.secs],
          ].map(([label, value]) => (
            <div className="countdown-box" key={label}>
              <strong key={value}>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p className="countdown-message">A new chapter of love begins ❤️</p>
      </section>

      {/* 7. VENUES */}

      <section className="section venue-section">
        <p className="eyebrow reveal">We welcome you</p>

        <h2 className="script reveal">Wedding Venues</h2>

        <div className="venue-grid">
          <article className="venue-card reveal">
            <div className="venue-icon">🛕</div>
            <h3>Wedding Temple</h3>
            <p>Sri Jaganatha Perumal ThiruKovil</p>
            <span>Coimbatore, Tamil Nadu</span>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Sri+Jaganatha+Perumal+Thirukovil+Coimbatore"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions ↗
            </a>
          </article>

          <article className="venue-card reveal">
            <div className="venue-icon">🏛️</div>
            <h3>Wedding Hall</h3>
            <p>Shree Aksshayam</p>
            <span>Peelamedu, Coimbatore</span>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Shree+Aksshayam+Peelamedu+Coimbatore"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions ↗
            </a>
          </article>
        </div>

        {/* <div className="venue-map reveal">
          <iframe
            title="Wedding venue map"
            loading="lazy"
            src="https://www.google.com/maps?q=Shree+Aksshayam+Peelamedu+Coimbatore&output=embed"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div> */}
      </section>

      {/* 8. FOOTER */}

      <footer className="footer">
        <div className="footer-symbol">❦</div>

        <h2 className="script">Together Forever</h2>

        <p>Your presence and blessings mean the world to us.</p>

        <p className="footer-names">
          {COUPLE.groom} &amp; {COUPLE.bride}
        </p>

        <p className="footer-tamil">அன்புடன் வரவேற்கிறோம்</p>

        <p className="footer-date">10 December 2026</p>
      </footer>
    </main>
  );
}
