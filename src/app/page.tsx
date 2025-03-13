"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const caesarCipher = (text: string, shift: number): string => {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const shiftBase = char === char.toUpperCase() ? 65 : 97;
            return String.fromCharCode(((code - shiftBase + shift) % 26 + 26) % 26 + shiftBase);
        }
        return char;
    }).join('');
};

function CaesarCipherResultDialog({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: string }) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(result);
            alert('Copied to clipboard!');
        } catch (error) {
            console.error("Copy failed: ", error);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-[#1c1c1c] text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Result</AlertDialogTitle>
                    <AlertDialogDescription>
                        {result}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} className="bg-[#2c2c2c] text-white hover:bg-[#444]">Close</AlertDialogCancel>
                    <AlertDialogAction onClick={copyToClipboard} className="bg-[#2c2c2c] text-white hover:bg-[#444]">Copy Result</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Home() {
    const [text, setText] = useState<string>("");
    const [shift, setShift] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [textError, setTextError] = useState<string | null>(null);
    const [inputError, setInputError] = useState<string | null>(null); // New state for input error
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");
    const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 2000) {
            setTextError("Text cannot exceed 2000 characters.");
        } else {
            setTextError(null);
            setText(value);
        }
    };

    const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value < 1 || value > 25) {
            setError("Shift value must be between 1 and 25.");
        } else {
            setError(null);
            setShift(value);
        }
    };

    const handleSubmit = () => {
        if (shift < 1 || shift > 25) {
            setError("Shift value must be between 1 and 25.");
        } else if (text.length === 0) {
            setInputError("Text cannot be empty.");
            setError(null);
            setTextError(null);
        } else if (text.length > 2000) {
            setTextError("Text cannot exceed 2000 characters.");
            setError(null);
            setInputError(null);
        } else {
            setError(null);
            setTextError(null);
            setInputError(null);

            try {
                const operation = isDecrypting ? -shift : shift;
                const processedText = caesarCipher(text, operation);
                setResult(processedText);
                setDialogOpen(true);
            } catch (error) {
                console.error("Error:", error);
                setError("An error occurred during processing.");
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center" style={{ backgroundColor: '#111111' }}>
            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: '#f0f0f1' }}>
                caesar cipher.
            </h2>
            <div className="mt-8" style={{ width: '60%', maxWidth: '600px' }}>
                <div className="mb-6 text-white">
                    <label htmlFor="text-input" className="block text-sm font-medium mb-2">
                        enter text to be encrypted / decrypted
                    </label>
                    <textarea
                        id="text-input"
                        placeholder="enter text"
                        className="w-full rounded-md border border-[#24242c] bg-[#24242c] px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none overflow-hidden"
                        onChange={handleTextInput}
                        value={text}
                    />
                    <p className="mt-2 text-muted-foreground text-xs">
                        {text.length} / 2000 characters
                    </p>
                    {textError && (
                        <p className="mt-2 text-red-500 text-sm">
                            {textError}
                        </p>
                    )}
                    {inputError && (
                        <p className="mt-2 text-red-500 text-sm">
                            {inputError}
                        </p>
                    )}
                </div>
                <div className="mt-6 text-white">
                    <label htmlFor="number-input" className="block text-sm font-medium mb-2">
                        enter the shift value
                    </label>
                    <input
                        id="number-input"
                        type="number"
                        placeholder="enter number"
                        className="w-full h-10 rounded-md border border-[#24242c] bg-[#24242c] px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onChange={handleShiftChange}
                        value={shift}
                    />
                    {error && (
                        <p className="mt-2 text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                    <div className="mt-4 flex justify-center gap-4">
                        <Button variant="outline" onClick={() => { setIsDecrypting(false); handleSubmit(); }}>
                            encrypt
                        </Button>
                        <Button variant="outline" onClick={() => { setIsDecrypting(true); handleSubmit(); }}>
                            decrypt
                        </Button>
                    </div>
                </div>
            </div>
            <footer className="fixed bottom-0 left-0 w-full bg-[#111111] text-white py-4">
                <div className="flex justify-center items-center gap-4">
                    <a
                        href="https://en.wikipedia.org/wiki/Caesar_cipher"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground"
                    >
                        click here to learn more about the <span className="underline opacity-50">caesar cipher</span> method
                    </a>
                    <span className="text-sm text-muted-foreground">|</span>
                    <a
                        href="https://github.com/moroii69"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground"
                    >
                        by <span className="underline opacity-50">ufraan</span>
                    </a>
                </div>
            </footer>

            <CaesarCipherResultDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} result={result} />

            <div className="desktop-notice">
                best viewed on desktop!
            </div>

            <style jsx>
                {`
					.desktop-notice {
						position: fixed;
						top: 0;
						right: 0;
						background-color: #111111;
						color: #64748b;
						padding: 0.5rem 1rem;
						border-bottom-left-radius: 8px;
						border-top-left-radius: 8px;
						font-size: 0.875rem;
						z-index: 1000; /* Ensure it is above other content */
						text-transform: lowercase;
					}

					.underline {
						text-decoration: underline;
					}

					.opacity-50 {
						opacity: 0.5;
					}
                `}
            </style>
        </main>
    );
}
