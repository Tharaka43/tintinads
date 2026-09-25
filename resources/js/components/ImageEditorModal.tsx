import React, { useState, useEffect, useRef } from 'react';

interface ImageEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: File | null;
    onSave: (editedFile: File) => void;
}

type Tool = 'blur' | 'emoji';
type EmojiType = '🌸' | '💖' | '🙈' | '😎' | '💋' | '👑';

const EMOJIS: EmojiType[] = ['🌸', '💖', '🙈', '😎', '💋', '👑'];

export default function ImageEditorModal({ isOpen, onClose, file, onSave }: ImageEditorModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [currentTool, setCurrentTool] = useState<Tool>('blur');
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>('🌸');
    
    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);

    // Keep track of canvas history for reset
    const [historyDataUrl, setHistoryDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && file) {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.src = url;
            img.onload = () => {
                setOriginalImage(img);
                initCanvas(img);
                URL.revokeObjectURL(url);
            };
        }
    }, [isOpen, file]);

    const initCanvas = (img: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set actual canvas resolution to image resolution
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setHistoryDataUrl(canvas.toDataURL());
    };

    const handleReset = () => {
        if (originalImage) {
            initCanvas(originalImage);
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // Calculate scale since canvas display size might be different from internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (currentTool === 'emoji') {
            const { x, y } = getCoordinates(e);
            drawEmoji(x, y);
            return;
        }
        
        if (currentTool === 'blur') {
            setIsDrawing(true);
            setStartPos(getCoordinates(e));
        }
    };

    const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || currentTool !== 'blur' || !startPos) return;
        
        // Prevent scrolling while drawing on mobile
        if ('touches' in e) {
            // e.preventDefault(); // handled via CSS touch-action
        }
        
        const pos = getCoordinates(e);
        setCurrentPos(pos);
        
        // Redraw canvas with current history + preview rectangle
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !historyDataUrl) return;

        const img = new Image();
        img.src = historyDataUrl;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // Draw preview rectangle
            ctx.strokeStyle = '#ec4899'; // pink-500
            ctx.lineWidth = 4 * (canvas.width / canvas.clientWidth); // scale border
            ctx.setLineDash([10, 10]);
            ctx.strokeRect(
                startPos.x, 
                startPos.y, 
                pos.x - startPos.x, 
                pos.y - startPos.y
            );
            ctx.setLineDash([]);
        };
    };

    const onPointerUp = () => {
        if (!isDrawing || currentTool !== 'blur' || !startPos || !currentPos) {
            setIsDrawing(false);
            return;
        }
        
        setIsDrawing(false);
        applyBlur(startPos, currentPos);
    };

    const applyBlur = (start: {x: number, y: number}, end: {x: number, y: number}) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !historyDataUrl) return;

        const img = new Image();
        img.src = historyDataUrl;
        img.onload = () => {
            // Clear and draw base
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Calculate rect coordinates ensuring positive width/height
            const x = Math.min(start.x, end.x);
            const y = Math.min(start.y, end.y);
            const width = Math.abs(start.x - end.x);
            const height = Math.abs(start.y - end.y);

            // Only apply if it's an actual rectangle
            if (width > 5 && height > 5) {
                // Save context state
                ctx.save();
                
                // Create clipping path
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.clip();

                // Apply blur filter and redraw the image inside the clipped area
                ctx.filter = 'blur(15px)';
                ctx.drawImage(img, 0, 0);
                
                // Restore context (removes clip and filter)
                ctx.restore();
            }

            // Save new history state
            setHistoryDataUrl(canvas.toDataURL());
            setStartPos(null);
            setCurrentPos(null);
        };
    };

    const drawEmoji = (x: number, y: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const fontSize = Math.max(canvas.width, canvas.height) * 0.15; // 15% of max dimension
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedEmoji, x, y);
        
        setHistoryDataUrl(canvas.toDataURL());
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !file) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const newFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                onSave(newFile);
            }
        }, file.type, 0.9);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit & Hide Faces</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
                </div>

                {/* Toolbar */}
                <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentTool('blur')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentTool === 'blur' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <i className="fas fa-tint mr-2"></i> Blur Area
                        </button>
                        <button
                            onClick={() => setCurrentTool('emoji')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentTool === 'emoji' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <i className="fas fa-smile mr-2"></i> Emoji
                        </button>
                    </div>

                    {currentTool === 'emoji' && (
                        <div className="flex gap-2 bg-white p-2 rounded-lg border shadow-sm overflow-x-auto">
                            {EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedEmoji(emoji)}
                                    className={`text-2xl p-1 rounded hover:bg-gray-100 ${selectedEmoji === emoji ? 'ring-2 ring-pink-500 bg-pink-50' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <button onClick={handleReset} className="text-sm font-medium text-gray-500 hover:text-gray-800">
                        <i className="fas fa-undo mr-1"></i> Reset Image
                    </button>
                </div>

                {/* Canvas Area */}
                <div 
                    ref={containerRef}
                    className="flex-grow bg-gray-900 overflow-auto flex justify-center items-center p-4 relative touch-none"
                    style={{ minHeight: '50vh' }}
                >
                    <p className="absolute top-4 left-0 right-0 text-center text-white/50 text-sm pointer-events-none">
                        {currentTool === 'blur' ? 'Draw a rectangle over a face to blur it.' : 'Click anywhere on the image to place an emoji.'}
                    </p>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={onPointerDown}
                        onMouseMove={onPointerMove}
                        onMouseUp={onPointerUp}
                        onMouseLeave={onPointerUp}
                        onTouchStart={onPointerDown}
                        onTouchMove={onPointerMove}
                        onTouchEnd={onPointerUp}
                        className="max-w-full max-h-full object-contain cursor-crosshair shadow-lg rounded"
                        style={{ touchAction: 'none' }} // Prevent scrolling when drawing on touch devices
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                    <button onClick={saveImage} className="px-6 py-2 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 shadow-md transition-colors">
                        <i className="fas fa-check mr-2"></i> Save & Use Image
                    </button>
                </div>
            </div>
        </div>
    );
}
