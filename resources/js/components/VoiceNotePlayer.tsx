import React, { useState, useRef, useEffect } from 'react';

interface VoiceNotePlayerProps {
    audioUrl?: string | null;
    spokenText?: string | null;
    category?: string;
    title?: string;
    compact?: boolean;
}

// Waveform bar heights (in px) simulating a natural human speech waveform
const WAVE_BARS = [
    8, 14, 22, 12, 18, 28, 20, 14, 24, 30, 16, 26, 32, 22, 18, 28,
    24, 16, 30, 26, 18, 12, 22, 16, 24, 20, 14, 18, 12, 16, 10, 6
];

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
    audioUrl,
    spokenText,
    category = '',
    title = '',
    compact = false,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(8); // default fallback ~8s
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
    const [showTranscript, setShowTranscript] = useState<boolean>(false);

    // Resolve audio URL fallback based on category
    const resolvedAudioUrl = React.useMemo(() => {
        if (audioUrl && audioUrl.trim().length > 0) {
            return audioUrl;
        }
        const cat = category.toLowerCase();
        if (cat.includes('cam')) return '/storage/audio/voice_live_cam.mp3';
        if (cat.includes('spa') || cat.includes('wellness')) return '/storage/audio/voice_spa_wellness.mp3';
        if (cat.includes('boy')) return '/storage/audio/voice_boys_personal.mp3';
        if (cat.includes('shemale')) return '/storage/audio/voice_shemale_personal.mp3';
        return '/storage/audio/voice_girls_personal.mp3';
    }, [audioUrl, category]);

    // Resolve spoken text fallback based on category
    const resolvedSpokenText = React.useMemo(() => {
        if (spokenText && spokenText.trim().length > 0) {
            return spokenText;
        }
        const cat = category.toLowerCase();
        if (cat.includes('cam')) {
            return 'හායි, මගේ ලයිව් කැම් සර්විස් එකට ඔයාලව සාදරයෙන් පිළිගන්නවා. ඇඩ් එකේ තියෙන විස්තර බලලා, ලයිව් වීඩියෝ පැකේජ් ගන්න කැමති නම් දැන්ම මට WhatsApp මැසේජ් එකක් දාන්න.';
        }
        if (cat.includes('spa') || cat.includes('wellness')) {
            return 'ආයුබෝවන්. අපගේ ස්පා සහ සම්බාහන සේවාවන් ලබා ගැනීමට පෙර, කරුණාකර ඇඩ් එකේ විස්තර බලලා වේලාවක් වෙන් කරවා ගැනීමට දැන්ම අප අමතන්න. ස්තූතියි.';
        }
        if (cat.includes('boy')) {
            return 'හායි, මගේ ඇඩ් එකේ විස්තර හොඳට බලන්න. Genuine අය සහ Genuine girls ලා විතරක් මට කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්න.';
        }
        if (cat.includes('shemale')) {
            return 'හායි, මගේ ඇඩ් එකේ විස්තර සහ සේවාවන් හොඳට කියවලා, Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හෝ WhatsApp මැසේජ් එකක් දාන්නකෝ.';
        }
        return 'හායි, මගේ ඇඩ් එකේ තියෙන විස්තර සහ පැකේජ් හොඳට බලලා කියවන්න. Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්නකෝ.';
    }, [spokenText, category]);

    // Format seconds into MM:SS or M:SS
    const formatTime = (timeInSec: number): string => {
        if (isNaN(timeInSec) || timeInSec < 0) return '0:00';
        const mins = Math.floor(timeInSec / 60);
        const secs = Math.floor(timeInSec % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Toggle Play / Pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((err) => {
                console.warn('Audio playback error:', err);
            });
        }
    };

    // Cycle Playback Speed: 1x -> 1.5x -> 2x -> 1x
    const cycleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        const speeds = [1, 1.5, 2];
        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        const nextSpeed = speeds[nextIdx];
        audioRef.current.playbackRate = nextSpeed;
        setPlaybackSpeed(nextSpeed);
    };

    // Seek on waveform click
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        const targetTime = ratio * duration;
        audioRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
    };

    // Synchronize HTML audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => {
            if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            }
        };
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        const onError = () => {
            if (audio.src.includes('/storage/audio/')) {
                audio.src = audio.src.replace('/storage/audio/', '/audio/');
                audio.load();
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('error', onError);
        };
    }, [resolvedAudioUrl]);

    // Progress percentage
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-green-50 border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Hidden native audio element */}
            <audio
                ref={audioRef}
                src={resolvedAudioUrl}
                preload="metadata"
            />

            {/* Subtle decorative glow circle in corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Bar: Header & Badges */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        {isPlaying ? (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                            </>
                        ) : (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        )}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5 tracking-tight">
                        <i className="fas fa-microphone-alt text-emerald-600 text-sm"></i>
                        <span>දැන්වීම්කරුගේ හඬ පණිවිඩය</span>
                        <span className="text-[10px] sm:text-xs text-emerald-700/80 font-bold hidden sm:inline">(Voice Note)</span>
                    </h3>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                        <i className="fas fa-check-circle text-[9px]"></i>
                        <span>Verified Voice</span>
                    </span>
                </div>
            </div>

            {/* Instruction prompt */}
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-900/80 mb-3 leading-snug">
                ⚡ <strong className="text-emerald-950 font-bold">ඇමතීමට හෝ WhatsApp පණිවිඩ යැවීමට පෙර</strong> මෙම හඬ පටයට සවන් දෙන්න:
            </p>

            {/* Modern WhatsApp-Style Audio Bubble Player */}
            <div className="bg-white/95 backdrop-blur-xs border border-emerald-200 rounded-xl p-3 sm:p-3.5 shadow-xs flex flex-col gap-2.5">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Big Circular Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        type="button"
                        aria-label={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
                        className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-md transition-all duration-200 transform active:scale-95 ${
                            isPlaying
                                ? 'bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-200'
                                : 'bg-[#25D366] hover:bg-emerald-600 ring-4 ring-emerald-100 hover:ring-emerald-200'
                        }`}
                    >
                        {isPlaying ? (
                            <i className="fas fa-pause text-base sm:text-lg"></i>
                        ) : (
                            <i className="fas fa-play text-base sm:text-lg ml-0.5"></i>
                        )}
                    </button>

                    {/* Waveform Scrubber & Timers */}
                    <div className="flex-1 min-w-0">
                        {/* Interactive Waveform Bar Container */}
                        <div
                            onClick={handleSeek}
                            title="Click to seek"
                            className="h-9 flex items-center gap-[2px] sm:gap-[3px] cursor-pointer group py-1 select-none"
                        >
                            {WAVE_BARS.map((height, idx) => {
                                const barRatio = idx / WAVE_BARS.length;
                                const isCurrent = (duration > 0 ? currentTime / duration : 0) >= barRatio;
                                return (
                                    <div
                                        key={idx}
                                        style={{ height: `${height}px` }}
                                        className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 group-hover:opacity-90 ${
                                            isCurrent
                                                ? 'bg-emerald-600 shadow-2xs'
                                                : 'bg-gray-300'
                                        } ${isPlaying && isCurrent ? 'animate-pulse' : ''}`}
                                    />
                                );
                            })}
                        </div>

                        {/* Progress Bar & Timer */}
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-500 px-0.5">
                            <span className="text-emerald-700 font-mono font-black">
                                {formatTime(currentTime)}
                            </span>
                            <span className="text-gray-400 font-mono font-medium">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Speed Multiplier Pill (1x, 1.5x, 2x) */}
                    <button
                        onClick={cycleSpeed}
                        type="button"
                        title="Click to change playback speed"
                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black px-2 py-1.5 rounded-lg transition-all active:scale-95 flex-shrink-0"
                    >
                        {playbackSpeed}x
                    </button>
                </div>

                {/* Spoken Text Accordion Preview */}
                <div className="pt-2 border-t border-emerald-100 flex flex-col gap-1.5">
                    <button
                        type="button"
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center justify-between text-[11px] font-bold text-emerald-800 hover:text-emerald-900 transition-colors py-0.5"
                    >
                        <span className="flex items-center gap-1.5">
                            <i className="fas fa-comment-dots text-emerald-600 text-xs"></i>
                            <span>{showTranscript ? 'හඬ පටයේ සටහන සඟවන්න' : 'හඬ පටයේ සටහන බලන්න (Read text)'}</span>
                        </span>
                        <i className={`fas fa-chevron-down text-[10px] text-emerald-600 transition-transform duration-200 ${showTranscript ? 'rotate-180' : ''}`}></i>
                    </button>

                    {showTranscript && (
                        <div className="bg-emerald-50/90 border-l-4 border-emerald-500 rounded-r-lg p-2.5 text-xs text-gray-800 leading-relaxed font-medium animate-fadeIn">
                            <p className="italic">
                                <i className="fas fa-quote-left text-emerald-400 mr-1.5 text-[10px]"></i>
                                {resolvedSpokenText}
                                <i className="fas fa-quote-right text-emerald-400 ml-1.5 text-[10px]"></i>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Authentic Sinhala Voice Reassurance */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-800 font-semibold px-1">
                <span className="flex items-center gap-1">
                    <i className="fas fa-shield-alt text-emerald-600"></i>
                    <span>100% Genuine Sinhala Audio</span>
                </span>
                <span className="text-gray-500 font-normal">
                    TinTinAds Audio Protection
                </span>
            </div>
        </div>
    );
};

export default VoiceNotePlayer;
