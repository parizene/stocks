const LoadingProgress = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
      <div className="ml-4">Loading...</div>
    </div>
  );
};

export default LoadingProgress;
