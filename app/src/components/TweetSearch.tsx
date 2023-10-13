import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

type SearchProps = {
  children?: ReactNode;
  modelValue?: string;
  setModelValue?: (a: string) => void;
  placeholder?: string;
  disabled?: boolean;
  search: (a: string) => void;
};

export default function TweetSearch({
  children,
  modelValue,
  setModelValue,
  placeholder,
  disabled,
  search,
}: SearchProps) {
  const [text, setText] = useState(modelValue || "");
  const { handleSubmit, register } = useForm();
  const onSubmit = handleSubmit(() => {
    search(text);
  });

  return (
    <form onSubmit={onSubmit} className="relative border-b border-skin-primary">
      <input
        {...register("search")}
        type="text"
        value={text}
        className="w-full bg-fill-secondary py-4 pl-16 pr-32 text-color-secondary border-transparent"
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          setModelValue && setModelValue(e.target.value);
        }}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div
        className={
          (modelValue ? "text-color-secondary " : "text-color-third ") +
          "absolute inset-y-0 left-0 flex items-center justify-center pl-8 pr-2"
        }
      >
        {children}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-8">
        <button
          type="submit"
          className={
            (!disabled
              ? "bg-fill-third text-color-secondary hover:bg-focus hover:text-white "
              : "cursor-not-allowed bg-fill-third text-color-third ") +
            "rounded-full px-4 py-1 font-semibold"
          }
          disabled={disabled}
        >
          Search
        </button>
      </div>
    </form>
  );
}
