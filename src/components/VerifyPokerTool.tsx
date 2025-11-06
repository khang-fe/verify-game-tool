'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { InfoIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { useEffect, useState } from 'react';
import { verifyCardByIndex } from '@/lib/verify-card';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { STATIC_DECK_WITH_CARDCODE } from '@/lib/utils';
import MerkleProofChart from './MerkleProofChart';
import { decryptCardForUser } from '@/lib/decrypt';

const formSchema = z.object({
  cardIndex: z.string().min(1, 'Please provide a valid Card Index.'),
  cardHash: z.string().min(1, 'Please provide a valid Card Hash.'),
  deckRoot: z.string().min(1, 'Please provide a valid Deck Root.'),
  cardProof: z.string().min(1, 'Please provide a valid Card Proof.'),
  serverPubKey: z.string().optional(),
  clientKey: z.string().optional(),
  saltHex: z.string().optional(),
  vector: z.string().optional(),
  encryptedData: z.string().optional(),
  authTag: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const fakeData = {
  cardIndex: '0',
  cardHash: '94930376e19adc780a029b7937dfa510c3725e857fa444fba361953b6b6dce61',
  deckRoot:
    '0x05b8b355899bf6b43975875f24714a0391058b0f498b5328d49a75fa74353914',
  cardProof: [
    '0x3d4fea83a76c8f8dc596a1feb8590049bf9e0e29723bd8160b0720a2d93c5c48',
    '0x72b4fbc5de630267f81a520217f0891cc3f1c031d68b57eb7a5650680073d820',
    '0xdba1a227918e0dfcee06068189f5ece1147ca849c517ae7bb21c86de36b3c5a6',
    '0x585ecff118bb468ccb431ef12279efe25edcb087258184119bc969f77495d2e6',
    '0x278103b5b8312e466c9136d5375a452c773c0b16030175d12a8f5e0e0acc108e',
    '0x97a2d14e54a86fb887c880b012af69c4badd2cf5d947dae330265b2ffe19a124',
  ],
  serverPubKey:
    '049e7beb1f01b3e1a093c1f66c72ad3026548dfcf42d3d969e221efacfb9ffacc9c54c62298b006232bf9f1b178c0897bae5c200f053e32c690816b0d27f01efd5',
  clientKey: '82ed8eb2ddb80ab4102f90133118d7d17826de591a407b38254df7cecf65ba25',
  saltHex: '6a80103f',
  vector: '5999c03b5968657f302de504',
  encryptedData: '3c',
  authTag: 'c5b7228e070ebca40d693be7adb40d61',
};

export function VerifyPokerTool() {
  const queryParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const cardIndexQuery = queryParams.get('cindex');
  const cardHashQuery = queryParams.get('chash');
  const deckRootQuery = queryParams.get('droot');
  const cardProofQuery = queryParams.get('cproof');
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardIndex: '',
      cardHash: '',
      deckRoot: '',
      cardProof: '',
      serverPubKey: '',
      clientKey: '',
      saltHex: '',
      vector: '',
      encryptedData: '',
      authTag: '',
    },
  });

  const cardIndex = watch('cardIndex'); // 👈 theo dõi field "cardIndex"
  const cardHash = watch('cardHash'); // 👈 theo dõi field "cardHash"
  const deckRoot = watch('deckRoot'); // 👈 theo dõi field "deckRoot"
  const cardProof = watch('cardProof'); // 👈 theo dõi field "cardProof"

  const [isAvancedInfo, setIsAvancedInfo] = useState(false);
  const [isOpenModalResult, setIsOpenModalResult] = useState(false);
  const [isOpenModalError, setIsOpenModalError] = useState(false);
  const [cardCodeResult, setCardCodeResult] = useState<
    | {
        cardCode: number;
        cardIndex: number;
      }
    | any
  >(null);

  useEffect(() => {
    if (cardIndexQuery) setValue('cardIndex', cardIndexQuery);
    if (cardHashQuery) setValue('cardHash', cardHashQuery);
    if (deckRootQuery) setValue('deckRoot', deckRootQuery);
    if (cardProofQuery) setValue('cardProof', cardProofQuery);
    if (cardIndexQuery && cardHashQuery && deckRootQuery && cardProofQuery) {
      handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormData) => {
    setCardCodeResult(null);
    let isValid = false;

    try {
      isValid = verifyCardByIndex(
        parseInt(data.cardIndex),
        data.cardHash,
        JSON.parse(data.cardProof),
        data.deckRoot
      );
    } catch {
      setIsOpenModalError(true);
      setIsOpenModalResult(false);
      return;
    }

    if (isAvancedInfo && isValid) {
      try {
        if (
          data.clientKey &&
          data.serverPubKey &&
          data.saltHex &&
          data.vector &&
          data.encryptedData &&
          data.authTag
        ) {
          const decryptResult = await decryptCardForUser(
            data.clientKey,
            data.serverPubKey,
            data.saltHex,
            {
              iv: data.vector,
              enc: data.encryptedData,
              tag: data.authTag,
            }
          );
          if (decryptResult?.cardCode !== undefined) {
            setCardCodeResult({
              cardCode: decryptResult.cardCode,
              cardIndex: parseInt(data.cardIndex),
            });
          }
        }
      } catch {
        console.log('Decryption failed');
      }
    }

    if (!isValid) {
      setIsOpenModalError(true);
      setIsOpenModalResult(false);
    } else {
      setIsOpenModalError(false);
      setIsOpenModalResult(true);
    }
  };

  const onChangeIsAvancedInfo = (checked: boolean) => {
    setIsAvancedInfo(checked);
  };

  const handlePasteAll = () => {
    const stringFake = JSON.stringify(fakeData);

    if (navigator.clipboard) {
      navigator.clipboard.readText().then((text: any) => {
        try {
          console.log('Pasted text: ', text);
          // let data = JSON.parse(text);
          const data = JSON.parse(stringFake);
          // Basic fields
          if (data.cardIndex) setValue('cardIndex', String(data.cardIndex));
          if (data.cardHash) setValue('cardHash', data.cardHash);
          if (data.deckRoot) setValue('deckRoot', data.deckRoot);
          if (data.cardProof)
            setValue('cardProof', JSON.stringify(data.cardProof));

          // Advanced fields
          let hasAdvanced = false;
          if (data.serverPubKey) {
            setValue('serverPubKey', data.serverPubKey);
            hasAdvanced = true;
          }
          if (data.clientKey) {
            setValue('clientKey', data.clientKey);
            hasAdvanced = true;
          }
          if (data.saltHex) {
            setValue('saltHex', data.saltHex);
            hasAdvanced = true;
          }
          if (data.vector) {
            setValue('vector', data.vector);
            hasAdvanced = true;
          }
          if (data.encryptedData) {
            setValue('encryptedData', data.encryptedData);
            hasAdvanced = true;
          }
          if (data.authTag) {
            setValue('authTag', data.authTag);
            hasAdvanced = true;
          }
          if (hasAdvanced) setIsAvancedInfo(true);
          else setIsAvancedInfo(false);
        } catch (err) {
          console.error(
            'Clipboard data is not valid JSON or missing fields',
            err
          );
        }
      });
    }
  };

  type InputValidateProps = {
    name: keyof FormData;
  };

  const InputValidate: React.FC<InputValidateProps> = ({ name }) => {
    const pasteFromClipboard = async ({ field }: { field: any }) => {
      if (navigator.clipboard) {
        try {
          const text = await navigator.clipboard.readText();
          field.onChange(text);
        } catch (err) {
          console.error('Failed to read clipboard: ', err);
        }
      }
    };

    return (
      <div className="flex flex-col w-full items-center gap-3">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className="flex w-full justify-between items-center bg-[#F4F5F6] !rounded-xl shadow-sm">
              <Input
                {...field}
                id={name}
                type="text"
                placeholder={`Enter ${name}`}
                className={`w-full h-[48px] bg-[#F4F5F6] border-none shadow-none !rounded-xl forced-colors:blue forced-valid:blue ${
                  errors[name]
                    ? '!outline !outline-[#FF386A] !ring-orange-800 !outline-offset-0'
                    : ''
                }`}
              />
              {/* paste button */}
              <div
                onClick={() => {
                  pasteFromClipboard({ field });
                }}
                className="px-2 hover:cursor-pointer hover:opacity-60"
              >
                <img
                  src="images/paste-button.svg"
                  alt="paste-button"
                  width={42}
                  height={42}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        />
        {errors[name] ? (
          <span className="text-xs text-[#FF386A] text-left w-full">
            {errors[name]?.message}
          </span>
        ) : (
          <div className="flex items-start justify-start text-start w-full">
            <InfoIcon
              color="#777E90CC"
              className="mt-[2px]"
              width={12}
              height={12}
            />
            <span className="text-xs text-[#777E90CC] ml-2">
              The hash value of the seed server is announced before the game
            </span>
          </div>
        )}
      </div>
    );
  };

  const LabelValidation = ({
    title,
    isRequired = false,
  }: {
    title: string;
    isRequired?: boolean;
  }) => {
    return (
      <div className="flex justify-between w-full">
        <Label
          htmlFor={title}
          className="text-sm font-['roboto-semibold'] !text-[#777E90]"
        >
          {title} {isRequired && <span className="text-rose-600">*</span>}
        </Label>
      </div>
    );
  };

  const CustomModalWithResult = () => {
    return (
      <Dialog open={isOpenModalResult} onOpenChange={setIsOpenModalResult}>
        <DialogContent className="max-w-[360px] sm:max-w-[500px] bg-gradient-to-b from-green-100 !to-[60%] to-white px-3 sm:px-4 !rounded-[24px] shadow-lg">
          <DialogTitle />
          <DialogDescription />
          <DialogHeader>
            <div className="w-full flex flex-col items-center justify-center text-center px-1 sm:px-4">
              <img
                src="images/success-verify-logo.svg"
                alt="verifyPokerIcon"
                width={220}
                height={200}
                className="width-auto height-auto sm:w-[350px] max-w-[330px] md:max-w-[700px]"
              />
            </div>
            <p className='text-xl sm:text-2xl font-["roboto-semibold"] text-center text-[#23262F] mt-1'>
              Your card has been verified
            </p>
            <p className='text-sm sm:text-sm font-["roboto"] text-[#777E90] mt-1 mb-5 text-center w-[90%] mx-auto'>
              This card was dealt from a provably fair deck and matches the
              seed, proof, and shuffle record.
            </p>

            {cardCodeResult?.cardCode !== undefined && (
              <div className="flex flex-row gap-4 items-center justify-center mb-4 bg-[#F4F5F6] px-4 py-6 rounded-[12px] shadow-sm">
                <div className="mt-2 !w-[44px] !h-[44px] sm:w-[55px] sm:h-[55px] bg-[#F4F5F6] rounded-lg flex flex-col items-center justify-center shadow-md">
                  {(() => {
                    const image = `${STATIC_DECK_WITH_CARDCODE[0].image}`;
                    return image ? (
                      <img
                        src={image}
                        alt="verifyPokerIcon"
                        width={55}
                        height={55}
                        className="width-auto height-auto"
                      />
                    ) : null;
                  })()}
                </div>
                <div className='text-base font-["roboto"] flex flex-col gap-1 justify-between h-[44px]'>
                  <div>
                    <span className="text-[#777E90]">Position in Deck:</span>
                    <span className='text-[#353945] font-["roboto-semibold"] ml-2'>
                      {cardCodeResult?.cardIndex} / 52
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
          <DialogFooter className="w-full flex flex-row items-center justify-center gap-2 sm:gap-1">
            <DialogClose asChild>
              <Button
                className="h-[44px] !rounded-[8px] min-w-[100px] flex-1 sm:w-auto"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              className="h-[44px] bg-[#3772FF] text-[#000] !rounded-[8px] min-w-[100px] flex-1 sm:w-auto"
              onClick={() => setIsOpenModalResult(false)}
            >
              <span>Done</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const CustomErrorModal = () => {
    return (
      <Dialog open={isOpenModalError} onOpenChange={setIsOpenModalError}>
        <DialogContent className="max-w-[300px] sm:max-w-[500px] bg-gradient-to-b from-red-100 to-white !to-[60%] px-3 sm:px-4 !rounded-[24px] shadow-lg">
          <DialogTitle />
          <DialogDescription />
          <DialogHeader>
            <DialogTitle className="text-red-600"></DialogTitle>
            <div className="w-full flex flex-col items-center justify-center text-center px-1 sm:px-4">
              <img
                src="images/error-verify-logo.svg"
                alt="verifyPokerIcon"
                width={220}
                height={200}
                className="width-auto height-auto w-[100px] sm:w-[150px] max-w-[330px] md:max-w-[700px]"
              />
            </div>
            <p className='text-xl sm:text-2xl font-["roboto-semibold"] text-center text-[#23262F] mt-1'>
              Card verification failed
            </p>
            <p className='text-sm sm:text-sm font-["roboto"] text-[#777E90] mt-1 mb-5 text-center w-[90%] mx-auto'>
              The card does not match the deck’s seed or proof. Please check the
              game ID and verification inputs.
            </p>
          </DialogHeader>
          <DialogFooter className="w-[90%] mx-auto flex flex-row items-center justify-center gap-2 sm:gap-1">
            <DialogClose asChild>
              <Button
                className="h-[44px] !rounded-[8px] min-w-[100px] flex-1 sm:w-auto"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <CustomModalWithResult />
      <CustomErrorModal />
      <div className="mb-10 text-center flex flex-col items-center justify-start">
        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 mt-[-60px]">
          <img
            src="images/validateLogo.svg"
            alt="verifyPokerIcon"
            width={600}
            height={200}
            className="width-auto height-auto max-w-[330px] md:max-w-[700px]"
          />
        </div>
        <h1 className="font-bold mt-14 md:mt-28 mb-4 text-[36px] md:text-[48px] font-['roboto-semibold'] text-[#353945]">
          Validation Tool
        </h1>
        <span className='font-["roboto"] text-[#353945]'>
          At P Poker, we dont just promise fair games – we give you the tools to
          prove it yourself.
        </span>

        <div
          onClick={handlePasteAll}
          className='mt-5 hover:cursor-pointer hover:bg-slate-100 text-[#1A181E] px-3 py-3 text-sm font-["roboto"] rounded-[8px] border border-[##6E8EC] flex items-center justify-center'
        >
          <img
            src="images/ic_clipboard.svg"
            alt="copy-icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span>Paste all infomation</span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container mt-5 flex flex-col items-center px-0 md:px-6 mx-auto"
      >
        <div className="flex flex-col md:flex-row md:space-x-5 w-full justify-center items-center">
          {/*  Card Index */}
          <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
            <LabelValidation title="Card Index" isRequired={true} />
            <InputValidate name="cardIndex" />
          </div>

          {/*  Card Hash */}
          <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
            <LabelValidation title="Card Hash" isRequired={true} />
            <InputValidate name="cardHash" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-5 w-full justify-center items-center">
          {/* Deck Root */}
          <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
            <LabelValidation title="Deck Root" isRequired={true} />
            <InputValidate name="deckRoot" />
          </div>

          {/* Card Proof */}
          <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
            <LabelValidation title="Card Proof" isRequired={true} />
            <InputValidate name="cardProof" />
          </div>
        </div>

        <div className="w-full max-w-[1010px] mt-10 mb-5">
          <MerkleProofChart
            data={{
              cardIndex: cardIndex,
              cardHash: cardHash,
              deckRoot: deckRoot,
              cardProof: cardProof ? JSON.parse(cardProof) : [],
            }}
          />
        </div>

        {/* Advanced Information */}
        <div className="my-5 w-full max-w-[1010px]">
          <div className="flex justify-between items-center w-full">
            <span className='font-["roboto-semibold"] text-sm'>
              Advanced Informations
            </span>
            <Switch
              checked={isAvancedInfo}
              onCheckedChange={onChangeIsAvancedInfo}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-5 w-full justify-center items-center">
          {/* User Key (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Server Public Key" />
              <InputValidate name="serverPubKey" />
            </div>
          )}

          {/* Client Key (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Client Private Key" />
              <InputValidate name="clientKey" />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:space-x-5 w-full justify-center items-center">
          {/* Salt Hex (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Salt Hex" />
              <InputValidate name="saltHex" />
            </div>
          )}

          {/* Initialization Vector (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Initialization Vector" />
              <InputValidate name="vector" />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:space-x-5 w-full justify-center items-center">
          {/* Encrypted Data (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Encrypted Data" />
              <InputValidate name="encryptedData" />
            </div>
          )}

          {/* Authentication Tag (Conditional) */}
          {isAvancedInfo && (
            <div className="grid max-w-[500px] w-full items-center gap-2 my-3">
              <LabelValidation title="Authentication Tag" />
              <InputValidate name="authTag" />
            </div>
          )}
        </div>

        {/* Verify Button */}
        <div className="w-full max-w-[1020px] my-5 md:static md:my-5">
          <div className="fixed bottom-0 left-0 w-full px-4 py-3 pb-5 bg-white shadow-[0_-2px_16px_rgba(0,0,0,0.04)] md:static md:px-0 md:py-0 md:bg-transparent md:shadow-none z-20">
            <Button
              type="submit"
              className="w-full h-[44px] bg-[#3772FF] !rounded-[8px]"
            >
              <span>Verify</span>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
