import React, { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";

const STEPS = {
  COUNTDOWN: 0,
  INTRO: 1,
  CAKE: 2,
  BALLOONS: 3,
  PHOTOS: 4,
  MESSAGE_CARD: 5,
  FINAL_GIFT: 6,
};

function App() {
  const [step, setStep] = useState(STEPS.COUNTDOWN);
  const [countdown, setCountdown] = useState(3);

  // Cake step state
  const [cakeStage, setCakeStage] = useState("decorate"); // "decorate" | "light" | "pop"
  const [decorated, setDecorated] = useState(false);
  const [candleLit, setCandleLit] = useState(false);

  // Balloons state
  const [balloons, setBalloons] = useState([
    { id: 1, text: "You", popped: false },
    { id: 2, text: "are", popped: false },
    { id: 3, text: "so", popped: false },
    { id: 4, text: "special", popped: false },
  ]);

  const allBalloonsPopped = balloons.every((b) => b.popped);

  // Photos
const photos = [
  "/daraksha1.jpg",
  "/daraksha2.jpg",
  "/daraksha3.jpg",
  "/daraksha4.jpg",
];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoSwipe, setPhotoSwipe] = useState(false);

  // Message card
  const [cardOpen, setCardOpen] = useState(false);

  // Gift modal
  const [showGiftModal, setShowGiftModal] = useState(false);

  // Global confetti flag
  const [confetti, setConfetti] = useState(false);

  // -------- countdown logic ----------
  useEffect(() => {
    if (step !== STEPS.COUNTDOWN) return;
    if (countdown <= 0) {
      const t = setTimeout(() => setStep(STEPS.INTRO), 600);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, step]);

  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1200);
  };

  // Cake button click handling
  const handleCakeButton = () => {
    if (cakeStage === "decorate") {
      setDecorated(true);
      setCakeStage("light");
    } else if (cakeStage === "light") {
      setCandleLit(true);
      triggerConfetti();
      setCakeStage("pop");
    } else if (cakeStage === "pop") {
      setStep(STEPS.BALLOONS);
    }
  };

  // Balloons
  const handlePopBalloon = (id) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    triggerConfetti();
  };

  // Photos
  const handleNextPhoto = () => {
    setPhotoSwipe(true);
    setTimeout(() => {
      setPhotoSwipe(false);
      setPhotoIndex((idx) => (idx + 1) % photos.length);
    }, 300);
  };

  // Replay full experience
  const handleReplay = () => {
    setStep(STEPS.COUNTDOWN);
    setCountdown(3);
    setCakeStage("decorate");
    setDecorated(false);
    setCandleLit(false);
    setBalloons([
      { id: 1, text: "You", popped: false },
      { id: 2, text: "are", popped: false },
      { id: 3, text: "so", popped: false },
      { id: 4, text: "special", popped: false },
    ]);
    setPhotoIndex(0);
    setCardOpen(false);
    setShowGiftModal(false);
    setConfetti(false);
  };

  return (
    <div className="app-root">
      <div className="birthday-shell">
        <div className="floating-hearts" />
        <div className="bunting" />

        {confetti && <img src="/confetti.gif" className="confetti-gif" alt="confetti" />}


        {/* CONTENT */}
        <div className="inner-content">
          {step === STEPS.COUNTDOWN && <CountdownScreen count={countdown} />}

          {step === STEPS.INTRO && (
            <IntroScreen onStart={() => setStep(STEPS.CAKE)} />
          )}

          {step === STEPS.CAKE && (
            <CakeScreen
              decorated={decorated}
              candleLit={candleLit}
              cakeStage={cakeStage}
              onButtonClick={handleCakeButton}
            />
          )}

          {step === STEPS.BALLOONS && (
            <BalloonsScreen
              balloons={balloons}
              onPop={handlePopBalloon}
              allPopped={allBalloonsPopped}
              onNext={() => setStep(STEPS.PHOTOS)}
            />
          )}

          {step === STEPS.PHOTOS && (
            <PhotosScreen
              photos={photos}
              index={photoIndex}
              onSwipe={handleNextPhoto}
              swiping={photoSwipe}
              onNext={() => setStep(STEPS.MESSAGE_CARD)}
            />
          )}

          {step === STEPS.MESSAGE_CARD && (
            <MessageCardScreen
              open={cardOpen}
              onToggle={() => setCardOpen(true)}
              onNext={() => setStep(STEPS.FINAL_GIFT)}
            />
          )}

          {step === STEPS.FINAL_GIFT && (
  <FinalGiftScreen
    onTap={() => {
      // 1) pehle confetti
      triggerConfetti();

      // 2) thoda delay ke baad modal khol do
      setTimeout(() => {
        setShowGiftModal(true);
      }, 450); // 450 ms ~ aadha second
    }}
  />
)}

        </div>
      </div>

      {showGiftModal && (
        <GiftModal onClose={() => setShowGiftModal(false)} onReplay={handleReplay} />
      )}
    </div>
  );
}

/* ------------------- small components ------------------- */

function CountdownScreen({ count }) {
  return (
    <motion.div
      className="center-screen"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      key={count}
    >
      <div className="countdown-badge">Surprise loading...</div>
      <div className="countdown-number animate-pop">
        {count > 0 ? count : "🎉"}
      </div>
    </motion.div>
  );
}

function IntroScreen({ onStart }) {
  return (
    <motion.div
      className="center-screen fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src="https://media1.tenor.com/m/8_1QySrL5KUAAAAd/happy-dance-birthday.gif"
        className="cute-char-gif"
        alt="cute panda"
      />
      <h1 className="title-main">
        A short brain was born today,
        <br />
        <span>21 years ago!</span>
      </h1>
      <p className="subtitle">
        Yes, it&apos;s <span className="highlight">YOU</span>,
        <br />A little surprise awaits...
      </p>
      <motion.button
        className="primary-btn"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        🎁 Start the surprise
      </motion.button>
    </motion.div>
  );
}

/* ---------- UPDATED: Realistic cake + 2 ribbons + framer motion ---------- */

/* ---------- UPDATED: Realistic cake + single ribbon + animated flame ---------- */

function CakeScreen({ decorated, candleLit, cakeStage, onButtonClick }) {
  const buttonLabel =
    cakeStage === "decorate"
      ? "Decorate"
      : cakeStage === "light"
      ? "Light the Candle"
      : "Pop the Balloons";

  // sirf ek hi image use karni hai – candle off wali
  const cakeSrc = "/cake.png"; // public/cake.png

  return (
    <motion.div
      className="center-screen fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Decorate pe click ke baad ek hi ribbon image top se aayegi */}
      {decorated && (
        <motion.img
          src="/ribbon.png" // public/ribbon.png
          alt="ribbons"
          className="cake-ribbon-single"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 10 }}
        />
      )}

      <motion.div
        className="cake-img-wrapper"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        <motion.img
          src={cakeSrc}
          alt="birthday cake"
          className="cake-img"
          animate={
            candleLit
              ? {
                  y: [0, -4, 0],
                  boxShadow: [
                    "0 12px 26px rgba(0,0,0,0.7)",
                    "0 18px 32px rgba(0,0,0,0.85)",
                    "0 12px 26px rgba(0,0,0,0.7)",
                  ],
                }
              : {}
          }
          transition={
            candleLit
              ? { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
              : {}
          }
        />

        {/* Light the Candle pe animated flame overlay */}
        {candleLit && (
          <motion.div
            className="candle-flame-overlay"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: 1,
              y: [-2, 0, -2],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      <h2 className="title-main">
        {candleLit ? "Happy Birthday, Jannat!🥰" : "Make a wish on your cake!"}
      </h2>
      <motion.button
        className="primary-btn"
        onClick={onButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        {buttonLabel}
      </motion.button>
    </motion.div>
  );
}

/* ---------- Balloons: layout same, sirf smooth animation ---------- */

function BalloonsScreen({ balloons, onPop, allPopped, onNext }) {
  const poppedCount = balloons.filter((b) => b.popped).length;

  return (
    <motion.div
      className="center-screen fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="title-main small">Pop all 4 balloons 🎈</h2>
      <p className="subtitle tiny">
        Thoda time lagega, par har pop me ek chhoti si good vibe hai.
      </p>

      {/* 4 balloons side by side */}
      <div className="balloon-row">
        {balloons.map((b, i) => (
          <motion.div
            key={b.id}
            className="balloon-col"
            onClick={() => !b.popped && onPop(b.id)} // yahi se triggerConfetti() chalega
            animate={
              b.popped
                ? { y: 0, scale: 1 }
                : { y: [0, -10, 0] } // halka float
            }
            transition={{
              repeat: b.popped ? 0 : Infinity,
              repeatType: "mirror",
              duration: 2 + i * 0.2,
            }}
            whileHover={!b.popped ? { scale: 1.05 } : {}}
            whileTap={!b.popped ? { scale: 0.95 } : {}}
          >
            {/* balloon ya burst */}
            {!b.popped ? (
              <div className={`balloon-circle balloon-circle-${i + 1}`}>
                <span className="balloon-highlight" />
              </div>
            ) : (
              <motion.div
                className="balloon-burst"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            )}

            {/* seedha thread */}
            <div className="balloon-thread" />

            {/* word – sirf pop hone ke baad visible */}
            <motion.span
              className={`balloon-label ${b.popped ? "visible" : ""}`}
              initial={false}
              animate={b.popped ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            >
              {b.text}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* 0 / 4 popped counter */}
      <p className="balloon-counter">
        {poppedCount} / {balloons.length} popped
      </p>

      {allPopped && (
        <>
          <p className="subtitle">It&apos;s your day, Daraksha 💕</p>
          <motion.button
            className="primary-btn"
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Next →
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

function PhotosScreen({ photos, index, onSwipe, swiping, onNext }) {
  const currentPhoto = photos[index];

  return (
    <motion.div
      className="center-screen fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="title-main small">Some Sweet Moments</h2>
      <p className="subtitle tiny">(Tap the card to swipe)</p>

      <motion.div
        key={currentPhoto} // photo change hote hi naya animation
        className="photo-single"
        onClick={onSwipe}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ backgroundImage: `url(${currentPhoto})` }}
      />

      <button className="primary-btn secondary" onClick={onNext}>
        Open my message
      </button>
    </motion.div>
  );
}

function MessageCardScreen({ open, onToggle, onNext }) {
  return (
    <div className="center-screen fade-in">
      <h2 className="title-main small">A Special Message</h2>
      <div
        className={`greeting-card ${open ? "open" : ""}`}
        onClick={!open ? onToggle : undefined}
      >
        <div className="card-front">
          <div className="card-balloons">🎈🎈🎈</div>
          <div className="card-front-text">Happy Birthday, Daraksha🎂</div>
          <div className="card-tap-hint">Tap to open</div>
        </div>
        <div className="card-inner">
          <p>
            Happy Birthday, Daraksha! 🎉
May God bless you with endless happiness and fulfill all your wishes today and always. I truly hope life keeps giving you reasons to smile and new opportunities to grow every single day.
          </p>
          <p>
            And yes… try to fight a little less 😄, try to grow a little taller 😂, and take life in a more chill way.
          </p>
          <p>
            Jokes apart, you really deserve all the love, success, peace, and beautiful moments life has to offer. I hope your days are filled with smiles, laughter, and positive vibes.
          </p>
        </div>
      </div>
      {open && (
        <button className="primary-btn" onClick={onNext}>
          Next →
        </button>
      )}
    </div>
  );
}

/* ---------- Final gift: original layout + framer bounce ---------- */

function FinalGiftScreen({ onTap }) {
  return (
    <motion.div
      className="center-screen fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="title-main small">One last thing...</h2>
      <motion.div
        className="gift-wrap"
        onClick={onTap}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
      >
        <div className="gift-box">
          <div className="gift-lid" />
          <div className="gift-body" />
          <div className="gift-ribbon" />
        </div>
      </motion.div>
      <p className="subtitle">Tap the gift 🎁</p>
    </motion.div>
  );
}

function GiftModal({ onClose, onReplay }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-gif">
          {/* yahan apna real cute gif link daal dena */}
          <img
  src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGVkOW1lbGZ4YjY1d2h1Y3NtbzFidTNkMzR6bWVqZmJxN2V2amw0biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tPplGWjN0xLybiU/giphy.gif"
  alt="birthday gif"
  className="modal-gif-img"
/>


        </div>
        <h3>Lots of wishes for you ❤️</h3>
        <p className="modal-text">
          Once again, Happy Birthday, Daraksha. Hope you loved your surprise. ✨
        </p>
        <div className="modal-actions">
          <button className="primary-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="primary-btn" onClick={onReplay}>
            ⟳ Replay
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
