import { PublicKey } from "@solana/web3.js";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, Modal } from "flowbite-react";
import { HiOutlineUserCircle } from "react-icons/hi";
import useTheme from "../hooks/useTheme";
import useWorkspace from "../hooks/useWorkspace";
import { createUserAlias, updateUserAlias } from "../pages/api/alias";
import { notifyLoading, notifyUpdate, toCollapse } from "../utils";

type FormValues = {
  name: string;
};

export default function UserEditModal({
  visible,
  setVisible,
  publicKey,
  alias,
}: {
  visible: boolean;
  setVisible: (a: boolean) => void;
  publicKey: PublicKey;
  alias: string;
}) {
  const LIMIT = 50;
  const { theme } = useTheme();
  const { register, handleSubmit, watch, resetField } = useForm<FormValues>();
  const workspace = useWorkspace();
  const canSend = watch("name") && watch("name") !== alias;

  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  const send = async (data: FormValues) => {
    if (workspace) {
      const toastId = notifyLoading(
        "Transaction in progress. Please wait...",
        theme
      );
      let result;
      if (alias === toCollapse(publicKey)) {
        result = await createUserAlias(
          workspace.program,
          workspace.wallet,
          data.name
        );
      } else {
        result = await updateUserAlias(
          workspace.program,
          workspace.wallet,
          data.name
        );
      }
      notifyUpdate(
        toastId,
        result.message,
        result.success ? "success" : "error"
      );
      if (result.success) {
        onClose();
      }
    }
  };

  const onClose = () => {
    resetField("name");
    setVisible(false);
  };

  return (
    <Modal show={visible} onClose={onClose} size="sm" popup={true}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Avatar
              img={`https://avatars.dicebear.com/api/jdenticon/${publicKey.toBase58()}.svg`}
              size="lg"
              rounded={true}
            />
          </div>
          <h2 className="mt-4 text-lg font-medium leading-6 text-color-primary">
            Edit Your Alias
          </h2>
          <div className="mt-2 text-color-secondary">
            <p className="text-sm">
              Change the alias that is displayed for your connected wallets
              publickey.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-skin-primary bg-fill-secondary px-3 text-color-secondary">
                    <HiOutlineUserCircle size={20} />
                  </span>
                  <input
                    {...register("name", {
                      required: true,
                      maxLength: LIMIT,
                    })}
                    id="name"
                    type="text"
                    className="form-input block w-full h-12 flex-1 text-color-secondary bg-transparent rounded-none rounded-r-md border-skin-primary"
                    placeholder={alias}
                    autoComplete="off"
                    maxLength={LIMIT}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={
                  (canSend
                    ? "bg-primary-500 "
                    : "bg-primary-300/80 cursor-not-allowed ") +
                  "px-4 py-2 font-semibold text-white rounded-md mt-6 mb-2 inline-flex w-full justify-center"
                }
                disabled={!canSend}
              >
                Update Alias!
              </button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
