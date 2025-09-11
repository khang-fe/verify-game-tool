import { useCallback, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Copy, Equal } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from './components/ui/separator';
import { sha256 } from '@/lib/utils';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent } from './components/ui/card';

function App() {
  const [serverhash, setServerhash] = useState<string>('');
  const [merkleRoot, setMerkleRoot] = useState<string>('');
  const [fairCode, setFairCode] = useState<string>('');
  const [reportCode, setReportCode] = useState<string>('');

  const PasteButton = async (inputField: string) => {
    const clipboardData = await navigator.clipboard.readText();
    if (!clipboardData) {
      toast.error('somethineg went wrong');
      return;
    }
    if (inputField === 'serverhash') setServerhash(clipboardData);
    if (inputField === 'merkleRoot') setMerkleRoot(clipboardData);
    if (inputField === 'reportCode') setReportCode(clipboardData);
    toast.success('Pasted from clipboard');
  };

  const combineHash = useCallback(async () => {
    console.log('combineHash called');
    const hash = serverhash + merkleRoot;
    const generatedHash = await sha256(hash);
    console.log('generatedHash', generatedHash);

    setFairCode(generatedHash);
  }, [serverhash, merkleRoot]);

  useEffect(() => {
    if (serverhash && merkleRoot) {
      combineHash();
    } else {
      setFairCode('');
    }
  }, [serverhash, merkleRoot, combineHash]);

  const onChangeServerHash = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerhash(e.target.value);
  };
  const onChangeMerkleRoot = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMerkleRoot(e.target.value);
  };

  return (
    <>
      <div className="mx-auto w-full flex justify-center gap-4 py-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="!text-3xl text-center">Verify Game Tool</h1>
      <div className="container mt-10">
        <Card>
          <CardContent>
            <div className="grid w-full max-w-md items-center gap-3">
              <div className="flex justify-between w-full">
                <Label htmlFor="serverhash" className="text-lg">
                  Server Seed Hashed:
                </Label>
                <Button
                  onClick={() => PasteButton('serverhash')}
                  type="submit"
                  variant="outline"
                >
                  <Copy className="h-4 w-4"></Copy>
                  <span className="text-sm">Paste</span>
                </Button>
              </div>
              <div className="flex w-full max-w-md items-center gap-3">
                <Input
                  onChange={onChangeServerHash}
                  value={serverhash}
                  id="serverhash"
                  type="text"
                  className="w-full h-12"
                />
              </div>
            </div>
            <div className="grid w-full max-w-md items-center gap-3 mt-4">
              <div className="flex justify-between w-full">
                <Label htmlFor="serverhash" className="text-lg">
                  Merkle Root:
                </Label>
                <Button
                  onClick={() => PasteButton('merkleRoot')}
                  type="submit"
                  variant="outline"
                >
                  <Copy className="h-4 w-4"></Copy>
                  <span className="text-sm">Paste</span>
                </Button>
              </div>
              <div className="flex w-full max-w-md items-center gap-3">
                <Input
                  onChange={onChangeMerkleRoot}
                  value={merkleRoot}
                  id="merkleRoot"
                  type="text"
                  className="w-full h-12"
                />
              </div>
            </div>
            <div className="grid w-full max-w-md items-center gap-3 mt-4">
              <Label htmlFor="fairCode" className="text-lg">
                Fair Code:
              </Label>

              <div className="flex w-full max-w-md items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">SHA256</span>
                  <Equal className="h-2 w-2"></Equal>
                </div>
                <span>
                  {fairCode ? (
                    <div className="flex flex-col gap-2 bg-slate-100 p-3 rounded-md">
                      <span className="font-mono break-all text-sm">
                        {fairCode}
                      </span>
                    </div>
                  ) : (
                    'Fair code will be generated here...'
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center mt-4">
          <Separator className="my-2" />
          <span className="text-sm text-center break-words">
            If you have a report code from the game, you can paste it here to
            verify Fair Code
          </span>
          <Separator className="my-2" />
        </div>

        <div className="grid w-full max-w-md items-center gap-3 mt-4">
          <div className="grid w-full max-w-md items-center gap-3">
            <div className="flex justify-between w-full">
              <Label htmlFor="reportCode" className="text-lg">
                Report Code:{' '}
              </Label>
              <Button
                onClick={() => PasteButton('reportCode')}
                type="submit"
                variant="outline"
              >
                <Copy className="h-4 w-4"></Copy>
                <span className="text-sm">Paste</span>
              </Button>
            </div>

            <Textarea
              onChange={e => setReportCode(e.target.value)}
              value={reportCode}
              placeholder={'Paste report code here...'}
              id="reportCode"
              className="h-[140px] w-full max-w-full"
            />

            <Button type="submit" variant="outline">
              <span className="text-sm">Verify Link</span>
            </Button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
