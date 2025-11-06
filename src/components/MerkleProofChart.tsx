'use client';
import { useMemo } from 'react';

export default function MerkleProofChart({ data }: any) {
  const treeNodes = useMemo(() => {
    const nodes = [
      {
        id: 'root',
        value: data.deckRoot,
        level: 0,
        isLeaf: false,
        isRoot: true,
      },
      ...data.cardProof.reverse().map((proof: string, index: number) => ({
        id: `proof-${index}`,
        value: proof,
        level: data.cardProof.length - index,
        isLeaf: false,
        isRoot: false,
      })),
      {
        id: 'leaf',
        value: `${data.cardHash}`,
        level: data.cardProof.length + 1,
        isLeaf: true,
        isRoot: false,
      },
    ];
    return nodes;
  }, [data]);

  return (
    <div className="relative w-full mx-auto py-2 pt-1 bg-gray-50 rounded-lg shadow-lg ">
      <div className="relative mb-10 flex flex-col  items-center justify-start">
        {/* Root Node */}
        <div className="">
          <div className="relative bg-amber-800 text-white px-4 py-2 max-w-2xl rounded-lg border-2 border-amber-600 shadow-md text-center break-all text-sm">
            <span className="font-mono">Root: {data.deckRoot}</span>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className=" w-1 h-[40px] bg-amber-400" />
        </div>
        {/* Proof Nodes and Lines */}
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-yellow-500 text-white max-w-2xl px-4 py-2 rounded-lg border-2 border-yellow-400 shadow-md m text-left break-all text-sm">
            <span className="font-mono">Proof:</span>
            {treeNodes.map((node, index) => {
              if (node.isLeaf) return null;
              if (node.isRoot) return null;
              return (
                <div key={index}>
                  {node.level}: {node.value}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className=" w-1 h-[40px] bg-amber-400" />
        </div>

        {/* Leaf Node */}
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-green-500 text-white max-w-2xl px-4 py-2 rounded-lg border-2 border-green-600 shadow-md m text-center break-all text-sm">
            <span className="font-mono">
              Leaf: {data.cardIndex} {data.cardHash}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-0 flex flex-col items-center space-y-2">
        <p className="text-sm text-gray-600">Merkle Proof Branch</p>
        <div className="flex space-x-4 text-xs">
          <span className="flex items-center">
            <div className="w-3 h-3 bg-amber-800 rounded mr-1"></div>Root
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>Proof
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>Leaf
          </span>
        </div>
      </div>
    </div>
  );
}
