import { FC } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "~/components/common";
import { Cart, craftMaterialList, dailyMaterialList, MaterialType, WrapType } from "~/types";
import AddCart from "./AddCart";

const Inventry: FC<{
  readonly?: boolean;
  dailyMaterials: number[];
  craftMaterials: number[];
  wrapType: WrapType;
  materialType: MaterialType;
  cart: Cart;
  addCart: (id: number) => void;
  removeCart: (id: number) => void;
}> = ({ readonly = false, dailyMaterials, craftMaterials, wrapType, materialType, cart, addCart, removeCart }) => {
  const list = materialType === "daily" ? dailyMaterialList : craftMaterialList;
  const materials = materialType === "daily" ? dailyMaterials : craftMaterials;
  return (
    <Table>
      <Thead h="8">
        <Tr>
          <Th>Name</Th>
          <Th>Balance</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {list.map((name, id) => (
          <Tr key={id} h="12" bgColor="blackAlpha.600">
            <Td>{name}</Td>
            <Td>{materials[id] || 0}</Td>
            <Td>
              <AddCart
                readonly={readonly}
                num={cart[wrapType][materialType][id]}
                balance={dailyMaterials[id]}
                handleClickPlus={() => addCart(id)}
                handleClickMinus={() => removeCart(id)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Inventry;
