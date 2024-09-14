import '../App.css'
import {ThreadFile} from "../models/File.ts";

interface ImageWidgetProps {
    files: ThreadFile[];
    showSlideShow: () => void;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ files, showSlideShow }) => {
    const baseURL = '/api/';
    return (
        <>
            <div className="m-3 flex flex-col items-center justify-center">
                <img
                    className="mt-3 object-contain max-w-full max-h-48 cursor-pointer"
                    onClick={showSlideShow}
                    src={baseURL + files[0].thumbnail}
                    alt={files[0].displayname}
                />
                <p>{files[0].displayname}</p>
            </div>
        </>
    );
};

export default ImageWidget