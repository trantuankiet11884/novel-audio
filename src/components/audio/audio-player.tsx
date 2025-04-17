"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Novel } from "@/lib/apis/api";
import {
  cleanText,
  getBase64Bin,
  getChapterText,
  splitText,
} from "@/lib/audio";
import { auth } from "@/lib/firebase/fconfig";
import { addToHistory } from "@/lib/history/history-utils";
import {
  FastForward,
  Gauge,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AudioPlayerSkeleton from "./audio-player-skeletion";

const SKIP_TIME = 10;
const COUNTDOWN_DURATION = 120;

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

interface AudioPlayerProps {
  novels: Novel;
  novelId: string;
  chapterIndex: number;
  totalChapters: number;
  novelSlug: string;
  voice?: string;
  isMobileView?: boolean;
  onChapterChange: (newIndex: number) => void;
}

export default React.memo(function AudioPlayer({
  novels,
  novelId,
  chapterIndex,
  totalChapters,
  novelSlug,
  voice = "google",
  isMobileView = false,
  onChapterChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(voice);
  const [playbackRate, setPlaybackRate] = useState("1");
  const [autoChapterChange, setAutoChapterChange] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioSrc("");
    setIsLoading(true);
  }, [chapterIndex]);

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const chapterData = await getChapterText(novelId, chapterIndex);
        if (chapterData.err) {
          console.error("Failed to get chapter text");
          setIsLoading(false);
          return;
        }

        const cleanedText = cleanText(chapterData.text);
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
        console.error("Failed to fetch audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, [novelId, chapterIndex, selectedVoice]);

  useEffect(() => {
    if (
      canPlay &&
      audioSrc &&
      audioRef.current &&
      !isPlaying &&
      !isLoading &&
      autoChapterChange
    ) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Autoplay error:", err));
      setAutoChapterChange(false);
    }
  }, [canPlay, audioSrc, isLoading, isPlaying, autoChapterChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = parseFloat(playbackRate);
    }
  }, [playbackRate, audioSrc]);

  useEffect(() => {
    const preventBypass = (e: Event) => {
      // Comment logic ngăn chặn phát nhạc
      // if (!countdownStarted) return;
      // countdownRef.current = setInterval(() => {
      //   setCountdown((prev) => {
      //     if (prev <= 1) {
      //       setCanPlay(true);
      //       if (countdownRef.current) {
      //         clearInterval(countdownRef.current);
      //         countdownRef.current = null;
      //       }
      //       return 0;
      //     }
      //     return prev - 1;
      //   });
      // }, 1000);
      // return () => {
      //   if (countdownRef.current) {
      //     clearInterval(countdownRef.current);
      //   }
      // };
    };

    const handleEnded = () => {
      if (chapterIndex < totalChapters - 1) {
        setAutoChapterChange(true);
        onChapterChange(chapterIndex + 1);
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("play", preventBypass);
      audio.addEventListener("canplay", () => {
        setDuration(audio.duration);
      });
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("play", preventBypass);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
      }
    };
  }, [canPlay, chapterIndex, totalChapters, onChapterChange]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const startCountdown = () => {
    setCountdownStarted(true);
  };

  const handlePlay = () => {
    if (!audioRef.current || !audioSrc) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((err) => console.error("Playback error:", err));
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && canPlay) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      onChapterChange(chapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapterIndex < totalChapters - 1) {
      onChapterChange(chapterIndex + 1);
    }
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlaybackRateChange = useCallback((value: string) => {
    setPlaybackRate(value);
  }, []);

  const handleSkipBack = () => {
    if (audioRef.current && canPlay) {
      const newTime = Math.max(0, audioRef.current.currentTime - SKIP_TIME);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current && canPlay) {
      const newTime = Math.min(
        audioRef.current.duration || 0,
        audioRef.current.currentTime + SKIP_TIME
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlayStart = () => {
    if (!audioRef.current || !audioSrc) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((err) => console.error("Playback error:", err));
        setIsPlaying(true);
      }
    }

    const userId = auth.currentUser?.uid;
    if (userId) {
      addToHistory(userId, novels, currentTime / duration, chapterIndex + 1);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (audioRef.current) {
      setCurrentTime(e.currentTarget.currentTime);
      setDuration(e.currentTarget.duration || 0);
    }

    const currentProgress = e.currentTarget.currentTime;
    const duration = e.currentTarget.duration;

    if (Math.floor(currentProgress) % 30 === 0 && currentProgress > 0) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        addToHistory(
          userId,
          novels,
          currentProgress / duration,
          chapterIndex + 1
        );
      }
    }
  };

  const handleComplete = () => {
    if (chapterIndex < totalChapters - 1) {
      setAutoChapterChange(true);
      onChapterChange(chapterIndex + 1);
    }

    const userId = auth.currentUser?.uid;
    if (userId) {
      addToHistory(userId, novels, currentTime / duration, chapterIndex + 1);
    }
  };

  const formattedDuration = useMemo(() => formatTime(duration), [duration]);

  return (
    <div
      className={`mx-auto w-full rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 ${
        isMobileView ? "fixed bottom-0 left-0 right-0 z-50" : ""
      }`}
    >
      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleComplete}
        className="hidden"
      />

      {isLoading ? (
        <AudioPlayerSkeleton isMobileView={isMobileView} />
      ) : (
        <div
          className={`space-y-3 ${isMobileView ? "space-y-2" : "space-y-6"}`}
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevChapter}
              disabled={chapterIndex <= 0}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isMobileView ? "h-8 w-8 p-0" : "px-3 py-2 sm:text-sm"
              }`}
            >
              <SkipBack className={`${isMobileView ? "h-4 w-4" : "h-4 w-4"}`} />
              {!isMobileView && (
                <span className="hidden sm:inline">Previous Chapter</span>
              )}
            </Button>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isMobileView
                ? `Ch. ${chapterIndex + 1}/${totalChapters}`
                : `Chapter ${chapterIndex + 1} / ${totalChapters}`}
            </span>

            <Button
              variant="outline"
              onClick={handleNextChapter}
              disabled={chapterIndex >= totalChapters - 1}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isMobileView ? "h-8 w-8 p-0" : "px-3 py-2 sm:text-sm"
              }`}
            >
              {!isMobileView && (
                <span className="hidden sm:inline">Next Chapter</span>
              )}
              <SkipForward
                className={`${isMobileView ? "h-4 w-4" : "h-4 w-4"}`}
              />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleSkipBack}
              variant="outline"
              size="icon"
              disabled={!audioSrc || !canPlay}
              title={`Skip back ${SKIP_TIME}s`}
              className={`${isMobileView ? "h-8 w-8" : "h-10 w-10"}`}
            >
              <Rewind className={`${isMobileView ? "h-4 w-4" : "h-5 w-5"}`} />
            </Button>

            <Button
              onClick={handlePlay}
              variant="outline"
              size="icon"
              // disabled={!audioSrc || !canPlay}
              className={`${isMobileView ? "h-10 w-10" : "h-12 w-12"}`}
            >
              {isPlaying ? (
                <Pause className={`${isMobileView ? "h-5 w-5" : "h-6 w-6"}`} />
              ) : (
                <Play className={`${isMobileView ? "h-5 w-5" : "h-6 w-6"}`} />
              )}
            </Button>

            <Button
              onClick={handleSkipForward}
              variant="outline"
              size="icon"
              disabled={!audioSrc || !canPlay}
              title={`Skip forward ${SKIP_TIME}s`}
              className={`${isMobileView ? "h-8 w-8" : "h-10 w-10"}`}
            >
              <FastForward
                className={`${isMobileView ? "h-4 w-4" : "h-5 w-5"}`}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-10 text-right text-xs text-gray-600 dark:text-gray-300">
              {formatTime(currentTime)}
            </span>

            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!canPlay || !audioSrc}
              className="flex-1"
            />

            <span className="w-10 text-left text-xs text-gray-600 dark:text-gray-300">
              {formattedDuration}
            </span>
          </div>

          {!isMobileView && canPlay && audioSrc && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Tip: Skip {SKIP_TIME}s backward or forward using the buttons
            </p>
          )}

          {/* Comment đoạn hiển thị UI đếm ngược */}
          {/*
          {!canPlay && (
            <div className="my-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {!countdownStarted ? (
                <Button
                  onClick={startCountdown}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Start {COUNTDOWN_DURATION}s Countdown to Play
                </Button>
              ) : (
                <div className="w-full rounded-md bg-amber-100 p-3 text-center text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200 sm:w-auto">
                  Please wait {countdown}s before playing...
                </div>
              )}

              <Button variant="default" className="w-full sm:w-auto">
                Remove Ads
              </Button>
            </div>
          )}
          */}

          {/* Voice and playback controls - hide on mobile */}
          {!isMobileView && (
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
                  disabled={!audioSrc || !canPlay}
                >
                  <SelectTrigger id="speed-select" className="w-full">
                    <SelectValue placeholder="Playback speed">
                      <div className="flex items-center">
                        <Gauge className="mr-2 h-4 w-4" />
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
          )}

          {/* Mobile-only compact speed control */}
          {isMobileView && (
            <div className="flex items-center justify-between">
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger className="h-8 text-xs px-2 py-0 w-24">
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem
                      key={voice.id}
                      value={voice.id}
                      className="text-xs"
                    >
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={playbackRate}
                onValueChange={handlePlaybackRateChange}
                disabled={!audioSrc || !canPlay}
              >
                <SelectTrigger className="h-8 text-xs px-2 py-0 w-20">
                  <SelectValue placeholder="Speed">
                    {
                      PLAYBACK_RATES.find((rate) => rate.value === playbackRate)
                        ?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PLAYBACK_RATES.map((rate) => (
                    <SelectItem
                      key={rate.value}
                      value={rate.value}
                      className="text-xs"
                    >
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
