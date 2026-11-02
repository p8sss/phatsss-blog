import React, { useEffect, useState } from "react"
import styles from "./CardPreview.module.css"

/**
 * CardPreview Component
 *
 * A visually appealing card with 3D hover effects that track mouse position
 * and create a dynamic tilt effect without using JavaScript.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {string} props.title - Main title text
 * @param {string} props.promptText - Text shown before hovering
 */
export default function CardPreview({
  children,
}: {
  children?: React.ReactNode
}) {

  // quote
  const quoteArray = [
    "I’m not lazy; I’m in energy-saving mode.",
    "Code happens.",
    "Ctrl+C, Ctrl+V. My greatest skills.",
    "No coffee, no code.",
    "It works on my machine.",
    "It’s not a bug, it’s an undocumented feature.",
    "I code. I stop. I code again.",
    "I’m not a robot.",
    "I’m not a magician.",
    "I’m not a wizard.",
    "404: Motivation not found.",
    "Python: Because nobody has time for semicolons.",
    "I don’t always test my code, but when I do, I do it in production.",
    "Code now, document never.",
    "There’s no place like ~/home.",
    "I’m not arguing; I’m explaining why my code is right.",
    "Debugging: 1% inspiration, 99% desperation.",
    "Why do Java devs wear glasses? They can’t C#.",
    "I’m not a bug, I’m a feature in beta.",
    "The best code is no code.",
    "Keep calm and git push --force."
  ]
  // State to hold the current quote
  const [currentQuote, setCurrentQuote] = useState("")
  const [fadeIn, setFadeIn] = useState(true)

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quoteArray.length)
    return quoteArray[randomIndex]
  }

  // Initialize with a random quote and change it periodically
  useEffect(() => {
    setCurrentQuote(getRandomQuote())

    const intervalId = setInterval(() => {
      setFadeIn(false)

      // Wait for fade out animation to complete before changing quote
      setTimeout(() => {
        setCurrentQuote(getRandomQuote())
        setFadeIn(true)
      }, 500) // This should match your CSS transition time

    }, 5000) // Change quote every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Create an array of 25 trackers for the hover effect grid
  const trackers = Array.from({ length: 25 }, (_, i) => i + 1)
  const subtitle = "Typescript | Javascript | React | NextJS | Tailwind | NodeJS | NestJS | ExpressJS | MongoDB | PostgreSQL | SQL | Prisma";

  // Determine text size class based on quote length
  const getTextSizeClass = () => {
    if (currentQuote.length < 15) return styles.largeText
    if (currentQuote.length < 30) return styles.mediumText
    return styles.smallText
  }
  // Render the component
  return (
    <div className={styles.container + " " + styles.noselect}>
      <div className={styles.canvas}>
        {/* Render all tracker divs that create the hover detection grid */}
        {trackers.map((num) => (
          <div
            key={num}
            className={`${styles.tracker} ${styles[`tr-${num}`]}`}
          />
        ))}

        {/* The main card that will be transformed on hover */}
        <div id={styles.card}>
          {/* Prompt text that disappears on hover */}
          <div className={styles.content}>
            <h2
              className={`${styles.quoteText} ${getTextSizeClass()} ${
                fadeIn ? styles.fadeIn : styles.fadeOut
              }`}
            >
              {`"${currentQuote}"`}
            </h2>
          </div>
          {/* Avatar image that appears on hover */}
          <div id={styles.prompt} className={styles.avatarContainer}>
            <img
              src="./img/phatsss-logo.png"
              width={677}
              height={314}
              alt="Developer Avatar"
              className={styles.avatar}
            />
          </div>

          {/* Main content of the card */}
          <div className={styles.title}>
            {/* {title.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))} */}

            {/* Additional content passed as children */}
            {children}
          </div>

          {/* <div className={styles.subtitle}>{subtitle}</div> */}
        </div>
      </div>
    </div>
  );
}
