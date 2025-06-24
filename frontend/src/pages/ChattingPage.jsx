import Chaters from "../components/Chat";

const ChattingPage = () => {
  return (
    <div className="flex items-center">
      <div className="max-w-50%">
        <Chaters />
      </div>
      <div className="max-w-50% mx-auto">
        <p className="text-4xl bold">Select anyone to satrt a chat.</p>
      </div>
    </div>
  );
};

export default ChattingPage;
