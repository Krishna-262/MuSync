"use client"
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import YouTube from 'react-youtube'
import { ChevronUp, ChevronDown, Plus, Play, Users, Share2, MessageCircleMore } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
// import { YouTubeEmbed } from "@next/third-parties/google"

const REFRESH_INTERVAL_MS = 6 * 1000; // 10 seconds , long polling

export default function StreamView({ creatorId, playVideo = false }) {

    const { data: session } = useSession();
    const userId = session?.user?.id ?? "";
    console.log(userId);


    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [previewVideoId, setPreviewVideoId] = useState(null)
    const [activeStream, setActiveStream] = useState(null);
    const [currentVideo, setCurrentVideo] = useState({
        videoId: '',
        title: '',
        submittedBy: '',
    });


    async function refreshStream() {
        console.log(`⏳ refreshStream called with ${creatorId}`);
        // console.log(userId);   // Fixed template string
        // console.log(creatorId); 
        try {
            const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);
            // for acrive streams
            const data1 = res.data;
            setActiveStream(data1.activeStream?.stream);
            // console.log("Active Stream Title:", activeStream?.title);
            // console.log("Active Stream Video ID:", activeStream?.url);


            // for all streams
            const videoArray = res.data.streams || [];

            const transformedQueue = videoArray.map((item) => ({
                id: item.id,
                videoId: item.extractedId,
                title: item.title,
                thumbnail: item.smallImg || `https://img.youtube.com/vi/${item.extractedId}/mqdefault.jpg`,
                votes: item.upVotes || 0,
                submittedBy: "Anonymous",
                hasVoted: item.haveupVoted ? "up" : null,
            }));

            console.log(transformedQueue);
            setQueue(transformedQueue.sort((a, b) => b.votes - a.votes));
        } catch (error) {
            // More robust error logging
            console.error("❌ Error in refreshStream:", {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data,
                stack: error?.stack,
            });
        }
    }

    useEffect(() => {
        if (activeStream?.url) {
            setCurrentVideo({
                videoId: extractVideoId(activeStream.url),
                title: activeStream.title || '',
                submittedBy: 'Anonymous',
            });
        }
    }, [activeStream]);

    useEffect(() => {
        refreshStream();
        const interval = setInterval(() => {
            refreshStream();
        }, REFRESH_INTERVAL_MS)

        return () => clearInterval(interval);
    }, [])


    const extractVideoId = (url) => {
        if (!url) return null; // <- 
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        ]

        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match) return match[1]
        }
        return null
    }

    const [queue, setQueue] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");




    const handleUrlChange = (url) => {
        setYoutubeUrl(url);
        const videoId = extractVideoId(url);

        if (videoId) {
            setPreviewVideoId(videoId);
        } else {
            setPreviewVideoId(null);
        }
    };


    const handleVote = async (itemId, voteType) => {
        try {
            const res = await fetch(`/api/streams/${voteType === "up" ? "upvote" : "downvote"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    streamId: itemId,
                    creatorId: userId, // make sure this is defined
                }),
            });

            if (!res.ok) {
                console.error("❌ Failed to register vote");
            }

            // ✅ Always refresh after voting to show latest data
            await refreshStream();
        } catch (error) {
            console.error("❌ Vote API call error:", error);
        }
    };




    const [shareMessage, setShareMessage] = useState("");
    const handleShare = async () => {
        const url = `${window.location.hostname}/creator/${creatorId}`;
        const title = "🎵 MuSync Voting"
        const text = "Vote for the next song on the stream! Submit your favorites and help decide what plays next."

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text,
                    url,
                })
            } else {
                await navigator.clipboard.writeText(url)
                setShareMessage("Link copied to clipboard!")
                setTimeout(() => setShareMessage(""), 3000)
            }
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea")
            textArea.value = url
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
            setShareMessage("Link copied to clipboard!")
            setTimeout(() => setShareMessage(""), 3000)
        }
    }

    const handleSubmit = async () => {
        if (!youtubeUrl) return;

        try {
            // Post video to backend (adjust payload & endpoint as needed)
            await axios.post('/api/streams', {
                creatorId: creatorId,
                url: youtubeUrl,
            });

            // Refresh the queue from backend
            await refreshStream();

            // Clear input and preview
            setYoutubeUrl("");
            setPreviewVideoId(null);
        } catch (error) {
            console.error("❌ Error submitting video:", error.response?.data || error.message);
        }
    };

    const handlePlayNext = async () => {
        try {
            const res = await axios.get(`/api/streams/next`);
            const nextStream = res.data.stream;
            console.log(nextStream);

            if (nextStream) {
                setActiveStream(nextStream);
            } else {
                alert("No next stream available.");
            }
        } catch (error) {
            console.error("❌ Error fetching next stream:", error);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 relative">
                    <div className="absolute top-0 right-0 p-2">
                        <div className="flex flex-row gap-2">
                            <Button
                                onClick={handleShare}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                            >
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                            </Button>

                            <Button
                                onClick={() => {
                                    const url = `${window.location.hostname}/creator/${creatorId}`;
                                    const message = encodeURIComponent(
                                        `Vote for the next song on the stream! Submit your favorites and help decide what plays next.\n${url}`
                                    )
                                    window.open(`https://wa.me/?text=${message}`, "_blank")
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <MessageCircleMore className="w-4 h-4" />
                            </Button>
                            {/* ✅ Logout Button */}
                            <Button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                size="sm"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </Button>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">🎵  MuSync Voting</h1>
                    <p className="text-purple-200">Vote for the next song or submit your own!</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Play className="w-5 h-5 text-red-500" />
                                    Now Playing
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                    <YouTube
                                        videoId={currentVideo.videoId}
                                        opts={{ height: '400', width: '100%' }}
                                        onEnd={handlePlayNext} // ✅ this triggers when the video ends
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-white">
                                        <h3 className="font-semibold text-lg">{currentVideo.title}</h3>
                                        <p className="text-purple-200">Submitted by {currentVideo.submittedBy}</p>
                                    </div>
                                    {creatorId === userId && (<Button
                                        onClick={handlePlayNext}
                                        className="mt-4 bg-purple-600 hover:outline hover:bg-purple-700 text-white"
                                    >
                                        Play Next
                                    </Button>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm mt-6">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-green-500" />
                                    Submit a Song
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste YouTube URL here..."
                                        value={youtubeUrl}
                                        onChange={(e) => handleUrlChange(e.target.value)}
                                        className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!previewVideoId}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        Submit
                                    </Button>
                                </div>

                                {previewVideoId && (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${previewVideoId}`}
                                            title="Preview"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Queue ({queue.length})
                                </CardTitle>
                            </CardHeader>
                            <div className="mb-4 ml-8 mr-8">
                                <input
                                    type="text"
                                    placeholder="Search by Youtube Title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[100%] mx-auto px-3 py-2 space-y-3 overflow-y-auto rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                                {queue.filter(item =>
                                    item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((item, index) => (
                                        <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={item.thumbnail || "/placeholder.svg"}
                                                        alt={item.title}
                                                        className="w-20 h-15 object-cover rounded"
                                                    />
                                                    <Badge className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs">#{index + 1}</Badge>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">{item.title}</h4>
                                                    <p className="text-purple-300 text-xs mb-2">by {item.submittedBy}</p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleVote(item.id, "up", item)}
                                                                className={`h-6 w-6 p-0 ${item.hasVoted === "up"
                                                                    ? "text-green-400 bg-green-400/20"
                                                                    : "text-gray-400 hover:text-green-400"
                                                                    }`}
                                                            >
                                                                <ChevronUp className="w-4 h-4" />
                                                            </Button>

                                                            <span className="text-white font-semibold text-sm min-w-[2rem] text-center">
                                                                {item.votes}
                                                            </span>

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleVote(item.id, "down", item)}
                                                                className={`h-6 w-6 p-0 ${item.hasVoted === "down"
                                                                    ? "text-red-400 bg-red-400/20"
                                                                    : "text-gray-400 hover:text-red-400"
                                                                    }`}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
