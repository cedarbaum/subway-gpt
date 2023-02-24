import { XMarkIcon } from "@heroicons/react/20/solid";

export type MessageType = "Info" | "Error";

export interface BannerProps {
  title: string;
  description: JSX.Element;
  onClose?: () => void;
}

export default function Banner({ title, description, onClose }: BannerProps) {
  return (
    <div className="flex bg-[#FCCC0A] py-2.5 px-6 sm:px-3.5 w-full">
      <p className="text-sm text-black">
        <span className="font-bold">{title}:</span> {description}
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon
            className="h-5 w-5 text-black"
            aria-hidden="true"
            onClick={onClose}
          />
        </button>
      </div>
    </div>
  );
}
