import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import InputWithIcon from './ui/forms/Form';

const initialBusinesses = [
  { id: 'biz-1', name: 'Business A', modules: [] },
  { id: 'biz-2', name: 'Business B', modules: [] },
];

const availableModules = [
  { id: 'mod-1', name: 'Inventory' },
  { id: 'mod-2', name: 'Logistics' },
  { id: 'mod-3', name: 'CRM' },
  { id: 'mod-4', name: 'Payments' },
];

const ItemTypes = {
  MODULE: 'module',
};

function Module({ module, onRemove }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MODULE,
    item: module,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-gray-800 text-white rounded-lg shadow-sm cursor-move flex justify-between items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      {module.name}
      {onRemove && (
        <button
          onClick={() => onRemove(module.id)}
          className="ml-4 text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function Business({ business, onDrop, onRemoveModule }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MODULE,
    drop: (item) => onDrop(business.id, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{business.name}</h2>
      <div
        className={`min-h-[100px] p-2 bg-gray-100 rounded ${isOver ? 'bg-blue-200' : ''}`}
      >
        {business.modules.map((mod) => (
          <Module
            key={mod.id}
            module={mod}
            onRemove={() => onRemoveModule(business.id, mod.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function DragAndDrop() {
  const [businesses, setBusinesses] = useState(initialBusinesses);

  const handleDrop = (businessId, module) => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((biz) =>
        biz.id === businessId && !biz.modules.find((m) => m.id === module.id)
          ? { ...biz, modules: [...biz.modules, module] }
          : biz
      )
    );
  };

  const handleRemoveModule = (businessId, moduleId) => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((biz) =>
        biz.id === businessId
          ? {
            ...biz,
            modules: biz.modules.filter((mod) => mod.id !== moduleId),
          }
          : biz
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Assign Modules to Businesses</h1>

        {/* Available Modules List */}
        <div className="mb-6">
          <h2 className="text-xl mb-2">Available Modules</h2>
          <div className="flex space-x-4">
            {availableModules.map((mod) => (
              <Module key={mod.id} module={mod} />
            ))}
          </div>
        </div>

        {/* Business Lists */}
        <div className="grid grid-cols-2 gap-4">
          {businesses.map((business) => (
            <Business
              key={business.id}
              business={business}
              onDrop={handleDrop}
              onRemoveModule={handleRemoveModule}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
