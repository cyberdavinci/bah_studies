"use client";
import React from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectSection,
  SelectItem,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/tables/SearchIcon";
import { EyeFilledIcon } from "@/app/(auth)/login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/app/(auth)/login/EyeSlashFilledIcon";
const SettingsModal = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [err, setIsErr] = React.useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const clearInputs = () => {
    setName((prev) => "");
    setEmail((prev) => "");
    setPassword((prev) => "");
    setRole((prev) => "");
  };

  const createUser = async (event) => {
    event.preventDefault();
    // console.log(name, email, password, role);
    try {
      const res = await fetch(`http://localhost:3000/api/create-user`, {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
        headers: { "Content-Type": "application/json" },
      });

      res.status === 201 ? clearInputs() : null;
      console.log(res);
    } catch (error) {
      setIsErr((prev) => error);
      console.log(error);
    }
  };
  //   console.log(err);
  return (
    <div>
      <div className="flex justify-between md:gap-10 gap-5 font-bold flex-wrap w-full">
        <Input
          type="text"
          placeholder="search user"
          startContent={<SearchIcon />}
        />
        <Button
          onPress={onOpen}
          variant="flat"
          color="success"
          className="font- w-full"
        >
          Add User
        </Button>
      </div>

      <div className="dark">
        <>
          {/* <Button onPress={onOpen}>Open Modal</Button> */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add a new user
                  </ModalHeader>
                  <form
                    className="flex flex-col gap-4 font-bold"
                    onSubmit={createUser}
                  >
                    <ModalBody>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        className="font-bold text-xl"
                        isRequired
                        required
                        size="lg"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName((prev) => e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        isRequired
                        required
                        size="lg"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail((prev) => e.target.value)}
                      />
                      <Input
                        // type="password"
                        placeholder="Password"
                        isRequired
                        required
                        size="lg"
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword((prev) => e.target.value)}
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                      />

                      <Select
                        label="Set user role"
                        className="dark text-xl font-bold"
                        isRequired
                        value={role}
                        onChange={(e) => setRole((prev) => e.target.value)}
                      >
                        <SelectItem
                          key={"subscriber"}
                          value={"subscriber"}
                          className="dark"
                        >
                          Subscriber
                        </SelectItem>
                        <SelectItem
                          key={"admin"}
                          value={"admin"}
                          className="dark font-bold"
                        >
                          Admin
                        </SelectItem>
                        {/* <SelectItem key={animal.value} value={animal.value}></SelectItem> */}
                      </Select>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        className="font-bold"
                        variant="light"
                        onPress={() => {
                          onClose();
                          clearInputs();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="success"
                        type="submit"
                        variant="flat"
                        className="font-bold"
                        //   onClick={createUser}
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </form>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      </div>
    </div>
  );
};

export default SettingsModal;
