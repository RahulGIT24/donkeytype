
import ProgressBar from "@ramonak/react-progress-bar";
const Loader = ({completed}:{completed:number}) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <ProgressBar completed={completed} maxCompleted={100} customLabel="Loading...." className="w-[40%]" bgColor="rgb(234 179 8 / var(--tw-text-opacity))" labelColor="black" labelSize="1rem"/>
    </div>
  )
} 

export default Loader
