import React from "react";

type Props = {
  mode?: "admin" | "customer";
  onSelect?: (table: string) => void;
};

const tables = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];
const cabins = ["C1", "C2", "C3", "C4", "C5"];
const outside = ["O1", "O2", "O3"];

const TableSelector: React.FC<Props> = ({ mode = "customer", onSelect }) => {
  const handleClick = (table: string) => {
    if (mode === "admin") {
      onSelect?.(table);
    }
  };

  const renderButtons = (items: string[]) =>
    items.map((item) => (
      <button
        key={item}
        onClick={() => handleClick(item)}
        className="bg-slate-700 text-white py-6 rounded-xl font-bold hover:bg-slate-600"
      >
        {item}
      </button>
    ));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-3">Tables</h3>
        <div className="grid grid-cols-4 gap-3">{renderButtons(tables)}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Cabins</h3>
        <div className="grid grid-cols-4 gap-3">{renderButtons(cabins)}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Outside</h3>
        <div className="grid grid-cols-3 gap-3">{renderButtons(outside)}</div>
      </div>
    </div>
  );
};

export default TableSelector;
