import logo from './logo.svg';
import './App.css';
import Led from './Led';
import { useEffect, useState } from 'react';
import HeartFrames from './heartanimation';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);


  
  const sendFramesToESP32 = async (frames) => {
    try {
      const response = await axios.post("http://192.168.4.1/frames", frames, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Frames sent:", frames);
      console.log("ESP32 responded:", response.data);
    } catch (error) {
      console.error("Error sending frames to ESP32:", error.message);
    }
  };
  
  const [Frames, setFrames] = useState(HeartFrames);
  useEffect(() => {
    // ResetFrames();
    
  }, [])
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex(prev => (prev === Frames.length - 1 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval); 
  }, [isPlaying, Frames.length]);
  const handleUpload = async () =>{
    sendFramesToESP32(Frames)
  }
  const handlePlay = () => {
    
    
    setIsPlaying(prev => !prev); 
  };
  
  const ResetFrames = () =>{
    setIsPlaying(false);
    setFrames(()=>{
      let Frame = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
      let Frames =[];
      for(let i=0;i<4;i++){
        Frames.push(Frame);
      }
      console.log(Frame);
      return Frames;
    })
    setCurrentFrameIndex(0)
  }

  const handleNextFrame = ()=>{


    if(currentFrameIndex === Frames.length-1){
      console.log(currentFrameIndex);
      setCurrentFrameIndex(0)
      return
    }
    setCurrentFrameIndex(currentFrameIndex+1)
    console.log(Frames.toString)

  }
  const handlePrevFrame = ()=>{
    if( currentFrameIndex === 0){
      setCurrentFrameIndex(Frames.length-1)
      return
    }
    setCurrentFrameIndex(currentFrameIndex-1)
  }
  const handleLedToggle = (rowIndex, colIndex, frameIndex) => {
    const newFrames = [...Frames];
    const newMatrix = Frames[frameIndex].map(row => [...row]); 
    newMatrix[rowIndex][colIndex] = newMatrix[rowIndex][colIndex] === 1 ? 0 : 1;
    newFrames[frameIndex] = newMatrix;
    setFrames(newFrames);
  };
  
  return (
    <div className="App w-screen flex flex-column items-start justify-center bg-white py-[100px] tracking-tighter">
      
      <div className='max-w-6xl sm:mx-auto flex flex-col'>
          <div className="status-center w-full flex flex-col lg:flex-row justify-center items-center sm:items-start sm:justify-start sm:gap-x-8">
                <div className='Logo-placeholder w-full flex flex-col items-start justify-center gap-2'>
                  <h1 className='text-xl sm:text-7xl font-bold text-gray-800 tracking-tighter'>
                    WriteLed.
                  </h1>
                  <h2 className='max-w-sm flex flex-col text-xl text-left font-bold text-gray-800 tracking-tighter leading-[20px]'>
                    an open source tool for animating custom LED animations for your LED matrix.
                  </h2>
                </div>
                <div className='status w-full flex flex-col items-end justify-center gap-2'>
                  <p className='leading-[20px] text-right max-w-sm text-sm'>
                  Connect your esp32 to your computer Hotpot and start animating.If connected correctly you should see a See all the lights glow..
                  </p>
                  <div className='flex items-center gap-2 mt-4'>
                    <p className='text-lg '>
                      Status
                    </p>
                    <div className='px-5 py-2 rounded-r-full rounded-l-full bg-green-500 border-[1px] border-black'>
                      Connected
                    </div>
                  </div>
                </div>
          </div>
          <div className='w-full flex flex-col justify-center items-center py-[80px]'>
                <div>
                  <h2 className='text-xl'>
                    Start animating your LED matrix
                  </h2>
                  <p className='text-xs'>
                    Click on the LED matrix to start animating
                  </p>
                  <button className='px-8 py-2 bg-green-500 text-black rounded-r-full rounded-l-full border-[1px] border-black mt-4 focus:scale-95 ease-in-out duration-200' onClick={() => handleUpload()}>
                    Upload
                  </button>
                  <div className='w-full flex justify-between items-center mt-4 gap-x-8' >
                        <button className='hover:underline bg-red-500 rounded-r-full rounded-l-full px-8 py-2 border-black border-[1px]' onClick={()=>ResetFrames()}>
                          Reset
                        </button>
                        <button className='hover:underline  bg-blue-500 rounded-r-full rounded-l-full px-8 py-2 border-black border-[1px]' onClick={()=>handlePlay()}>
                          play
                        </button>
                  </div>
                  <div className='w-full flex justify-between items-center mt-4 gap-x-[150px]' >
                        <button className='hover:underline flex gap-2 justify-center items-center' onClick={handlePrevFrame}>
                        <FaArrowLeft /> Prev
                        </button>
                        <p className='w-[200px]'>
                          Frame {currentFrameIndex+1} of {Frames.length}
                        </p>
                        <button className='hover:underline flex gap-2 justify-center items-center' onClick={handleNextFrame}>
                          Next  <FaArrowRight/>
                        </button>
                  </div>
                </div>
                <div className='min-w-[200px] max-w-lg h-full grid grid-cols-8 grid-rows-8 gap-4 mt-8'>
                  {
                    Frames.length && Frames[currentFrameIndex].map((row, rowIndex) => (
                            row.map((col, colIndex) => (
                                  <Led col={col} key={`${colIndex}`+`${rowIndex}`} colIndex={colIndex} rowIndex={rowIndex} frameIndex={currentFrameIndex} handleLedToggle={handleLedToggle}/>
                            ))
                          ))}
                </div>
          </div>
          <div>

          </div>
      </div>
    </div>  
  );
}

export default App;
