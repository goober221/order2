import '../App.css'
import {ThreadFile} from "../models/File.ts";

interface ImageWidgetProps {
    files: ThreadFile[];
    showSlideShow: (filePath: string) => void;
    isMobile: boolean;
    nsfwMode: boolean;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ files, showSlideShow, isMobile, nsfwMode}) => {
    const baseURL = '/api/';

    return (
        <>
            <div className={`m-3 flex gap-2 ${isMobile ? 'flex-col items-center h-1/2' : 'flex-row items-start w-1/4'}`}>
                <div className={`flex-shrink-0 ${isMobile ? 'w-full' : `${files.length > 1 ? 'w-4/5' : 'w-full'}`} ${nsfwMode ? 'opacity-10' : ''}`}>
                    <img
                        className={`mt-3 object-contain w-full  cursor-pointer ${isMobile ? 'max-h-36' : 'max-h-250px'}`}
                        onClick={() => showSlideShow('0')}
                        src={baseURL + files[0].thumbnail}
                        alt={files[0].displayname}
                    />
                    <p className="text-black dark:text-white">{files[0].displayname}</p>
                </div>

                {files.length > 1 && (
                    <div
                        className={`${isMobile ? 'flex-row w-full justify-center items-center' : 'flex-col w-1/5 justify-around'} gap-2 flex overflow-hidden`}
                    >
                        {files.slice(1).map((file, i) => (
                            <div className={`${isMobile ? 'h-full w-auto ' : 'w-full h-auto'} ${nsfwMode ? 'opacity-10' : ''}`} key={i}>
                                <img
                                    key={file.path}
                                    className={`object-contain cursor-pointer ${isMobile ? 'w-auto max-h-14' : 'w-full h-full mb-2'} `}
                                    onClick={() => showSlideShow((i + 1).toString())}
                                    src={baseURL + file.thumbnail}
                                    alt={file.displayname}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageWidget