let voicePrompt = {};
//播放音频
voicePrompt.startAudio = () => {
    new Audio('@/assets/audio/warn.wav').play();
};
export default voicePrompt;
