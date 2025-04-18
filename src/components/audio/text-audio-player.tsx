"use client";

import { Novel } from "@/lib/apis/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  cleanText,
  getBase64Bin,
  getChapterText,
  splitText,
} from "@/lib/audio";
import {
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaFastBackward,
  FaFastForward,
  FaTachometerAlt,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { auth } from "@/lib/firebase/fconfig";
import { addToHistory } from "@/lib/history/history-utils";

const SKIP_TIME = 10;

const VOICE_OPTIONS = [
  { id: "google", name: "Google" },
  { id: "en-US-ChristopherNeural", name: "Christopher (Microsoft)" },
  { id: "en-US-SaraNeural", name: "Sara (Microsoft)" },
  { id: "en-US-JennyNeural", name: "Jenny (Microsoft)" },
  { id: "en-US-GuyNeural", name: "Guy (Microsoft)" },
  { id: "en-US-AnaNeural", name: "Ana (Microsoft)" },
];

const PLAYBACK_RATES = [
  { value: "0.5", label: "0.5x" },
  { value: "0.75", label: "0.75x" },
  { value: "1", label: "1x (Normal)" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x" },
  { value: "1.75", label: "1.75x" },
  { value: "2", label: "2x" },
];

interface TextAudioPlayerProps {
  novel: Novel;
  novelId: string;
  chapterIndex: number;
  totalChapters: number;
  novelSlug: string;
  onChapterChange: (newIndex: number) => void;
}

export default function TextAudioPlayer({
  novel,
  novelId,
  chapterIndex,
  totalChapters,
  novelSlug,
  onChapterChange,
}: TextAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("google");
  const [playbackRate, setPlaybackRate] = useState("1");
  const [chapterText, setChapterText] = useState("");
  const [chapterSentences, setChapterSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const sentenceRefs = useRef<HTMLSpanElement[]>([]);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Fetch chapter text and audio
  useEffect(() => {
    const fetchChapterContent = async () => {
      setIsLoading(true);
      try {
        const chapterData = await getChapterText(novelId, chapterIndex);
        if (chapterData.err) {
          console.error("Failed to get chapter text");
          setIsLoading(false);
          return;
        }

        const cleanedText = cleanText(chapterData.text);
        setChapterText(cleanedText);

        // Split text into sentences for highlighting
        const sentences = splitText(cleanedText, true);
        setChapterSentences(sentences);
        sentenceRefs.current = sentences.map(() => null) as any;

        // Get audio for the first segment
        const textSegments = splitText(cleanedText);
        if (textSegments.length > 0) {
          const base64Audio = await getBase64Bin(
            textSegments[0],
            selectedVoice
          );
          if (base64Audio) {
            setAudioSrc(`data:audio/mp3;base64,${base64Audio}`);
          } else {
            console.error("No audio data received");
          }
        }
      } catch (error) {
        console.error("Failed to fetch chapter content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterContent();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentSentenceIndex(0);
  }, [novelId, chapterIndex, selectedVoice]);

  // Điều chỉnh để cải thiện việc highlight text
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (!audioRef.current) return;

    const currentTime = e.currentTarget.currentTime;
    const duration = e.currentTarget.duration || 0;

    setCurrentTime(currentTime);
    setDuration(duration);

    // Thay đổi phương pháp tính toán vị trí câu hiện tại
    const estimatedWordsPerMinute = 150; // Tốc độ đọc trung bình
    const playbackSpeedFactor = parseFloat(playbackRate);
    const wordsPerSecond = (estimatedWordsPerMinute / 60) * playbackSpeedFactor;

    // Tính toán số từ đã đọc dựa vào thời gian hiện tại
    const estimatedWordsRead = currentTime * wordsPerSecond;

    // Tìm câu hiện tại dựa trên số từ đã đọc
    let wordCount = 0;
    let newSentenceIndex = 0;

    for (let i = 0; i < chapterSentences.length; i++) {
      const sentenceWordCount = countWords(chapterSentences[i]);
      wordCount += sentenceWordCount;

      if (wordCount > estimatedWordsRead) {
        newSentenceIndex = i;
        break;
      }

      if (i === chapterSentences.length - 1) {
        newSentenceIndex = i;
      }
    }

    if (newSentenceIndex !== currentSentenceIndex) {
      setCurrentSentenceIndex(newSentenceIndex);

      // Scroll câu được highlight vào tầm nhìn
      if (sentenceRefs.current[newSentenceIndex] && textContainerRef.current) {
        sentenceRefs.current[newSentenceIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    // Lưu tiến trình đọc định kỳ
    if (Math.floor(currentTime) % 30 === 0 && currentTime > 0) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        addToHistory(userId, novel, currentTime / duration, chapterIndex + 1);
      }
    }
  };

  // Thêm hàm đếm số từ trong một chuỗi
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).length;
  };

  // Format time display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (!audioRef.current || !audioSrc) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  };

  // Handle seeking in audio
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);

      // Sử dụng cùng logic để xác định câu hiện tại
      const estimatedWordsPerMinute = 150;
      const playbackSpeedFactor = parseFloat(playbackRate);
      const wordsPerSecond =
        (estimatedWordsPerMinute / 60) * playbackSpeedFactor;
      const estimatedWordsRead = newTime * wordsPerSecond;

      let wordCount = 0;
      let newSentenceIndex = 0;

      for (let i = 0; i < chapterSentences.length; i++) {
        const sentenceWordCount = countWords(chapterSentences[i]);
        wordCount += sentenceWordCount;

        if (wordCount > estimatedWordsRead) {
          newSentenceIndex = i;
          break;
        }

        if (i === chapterSentences.length - 1) {
          newSentenceIndex = i;
        }
      }

      setCurrentSentenceIndex(newSentenceIndex);
    }
  };

  // Skip backward
  const handleSkipBack = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - SKIP_TIME);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Skip forward
  const handleSkipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(
        audioRef.current.duration || 0,
        audioRef.current.currentTime + SKIP_TIME
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Previous chapter
  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      onChapterChange(chapterIndex - 1);
    }
  };

  // Next chapter
  const handleNextChapter = () => {
    if (chapterIndex < totalChapters - 1) {
      onChapterChange(chapterIndex + 1);
    }
  };

  // Change voice
  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Change playback rate
  const handlePlaybackRateChange = (value: string) => {
    setPlaybackRate(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = parseFloat(value);
    }
  };

  // Handle chapter completion
  const handleComplete = () => {
    if (chapterIndex < totalChapters - 1) {
      onChapterChange(chapterIndex + 1);
    }

    const userId = auth.currentUser?.uid;
    if (userId) {
      addToHistory(userId, novel, 1, chapterIndex + 1);
    }
  };

  // Toggle player minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="flex flex-col space-y-6 mb-24 md:mb-32">
      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleComplete}
        className="hidden"
      />

      {/* Text display area with highlighting */}
      <Card className="p-6 h-[calc(100vh-300px)] overflow-y-auto bg-white dark:bg-gray-900 shadow-md">
        <div
          ref={textContainerRef}
          className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
        >
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-4/5"></div>
            </div>
          ) : (
            chapterSentences.map((sentence, index) => (
              <span
                key={index}
                ref={(el) => {
                  sentenceRefs.current[index] = el as HTMLSpanElement;
                }}
                className={`transition-colors duration-300 ${
                  index === currentSentenceIndex
                    ? "bg-yellow-200 dark:bg-yellow-900"
                    : ""
                }`}
              >
                {sentence}{" "}
              </span>
            ))
          )}
        </div>
      </Card>

      {/* Fixed bottom audio player */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ${
          isMinimized ? "h-16" : "h-auto"
        }`}
      >
        {/* Toggle button for minimize/maximize */}
        <button
          onClick={toggleMinimized}
          className="absolute cursor-pointer top-0 right-4 transform -translate-y-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-1 rounded-t-md"
        >
          {isMinimized ? (
            <FaChevronUp className="h-5 w-5" />
          ) : (
            <FaChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* Minimized player view */}
        {isMinimized && (
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                variant="ghost"
                size="sm"
                disabled={!audioSrc || isLoading}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? (
                  <FaPause className="h-4 w-4" />
                ) : (
                  <FaPlay className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs font-medium truncate max-w-[150px]">
                Ch. {chapterIndex + 1}: {formatTime(currentTime)} /{" "}
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex-1 mx-4 hidden sm:block">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                disabled={!audioSrc || isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePrevChapter}
                variant="ghost"
                size="sm"
                disabled={chapterIndex <= 0}
                className="h-8 w-8 p-0"
              >
                <FaStepBackward className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleNextChapter}
                variant="ghost"
                size="sm"
                disabled={chapterIndex >= totalChapters - 1}
                className="h-8 w-8 p-0"
              >
                <FaStepForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Full player view */}
        {!isMinimized && (
          <div className="p-4 space-y-4">
            {/* Chapter navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevChapter}
                disabled={chapterIndex <= 0}
                className="flex items-center gap-2"
              >
                <FaStepBackward className="h-4 w-4" />
                <span className="hidden sm:inline">Previous Chapter</span>
              </Button>

              <span className="text-sm font-medium">
                Chapter {chapterIndex + 1} / {totalChapters}
              </span>

              <Button
                variant="outline"
                onClick={handleNextChapter}
                disabled={chapterIndex >= totalChapters - 1}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next Chapter</span>
                <FaStepForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleSkipBack}
                variant="outline"
                size="icon"
                disabled={!audioSrc}
                title={`Skip back ${SKIP_TIME}s`}
                className="h-10 w-10"
              >
                <FaFastBackward className="h-5 w-5" />
              </Button>

              <Button
                onClick={handlePlayPause}
                variant="outline"
                size="icon"
                disabled={!audioSrc || isLoading}
                className="h-12 w-12"
              >
                {isPlaying ? (
                  <FaPause className="h-6 w-6" />
                ) : (
                  <FaPlay className="h-6 w-6" />
                )}
              </Button>

              <Button
                onClick={handleSkipForward}
                variant="outline"
                size="icon"
                disabled={!audioSrc}
                title={`Skip forward ${SKIP_TIME}s`}
                className="h-10 w-10"
              >
                <FaFastForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress slider */}
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-xs text-gray-600 dark:text-gray-300">
                {formatTime(currentTime)}
              </span>

              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                disabled={!audioSrc || isLoading}
                className="flex-1"
              />

              <span className="w-10 text-left text-xs text-gray-600 dark:text-gray-300">
                {formatTime(duration)}
              </span>
            </div>

            {/* Voice and playback settings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="voice-select"
                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Voice
                </label>
                <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                  <SelectTrigger id="voice-select" className="w-full">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="speed-select"
                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Playback Speed
                </label>
                <Select
                  value={playbackRate}
                  onValueChange={handlePlaybackRateChange}
                  disabled={!audioSrc}
                >
                  <SelectTrigger id="speed-select" className="w-full">
                    <SelectValue placeholder="Playback speed">
                      <div className="flex items-center">
                        <FaTachometerAlt className="mr-2 h-4 w-4" />
                        {
                          PLAYBACK_RATES.find(
                            (rate) => rate.value === playbackRate
                          )?.label
                        }
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYBACK_RATES.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
