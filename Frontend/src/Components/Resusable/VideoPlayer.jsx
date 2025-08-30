import React from 'react';

const VideoPlayer = ({ video }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md w-full bg-black">
      <video
        src={video}
        controls
        width="100%"
        height="360"
        preload='true'
        className="bg-black rounded-lg"

      />
    </div>
  );
};

export default VideoPlayer;
