import { FC } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "~/components/common";
import { Cart, craftMaterialList, dailyMaterialList, MaterialType, WrapType } from "~/types";
import AddCart from "./AddCart";

const Inventry: FC<{
  dailyMaterials: number[];
  craftMaterials: number[];
  wrapType: WrapType;
  materialType: MaterialType;
  cart: Cart;
  addCart: (id: number) => void;
  removeCart: (id: number) => void;
  hideCart?: boolean;
}> = ({ dailyMaterials, craftMaterials, wrapType, materialType, cart, addCart, removeCart, hideCart }) => {
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
        {materialType === "daily" ? (
          <>
            {dailyMaterialList.map((name, id) => (
              <Tr key={id} h="12" bgColor="blackAlpha.600">
                <Td>{name}</Td>
                <Td>{dailyMaterials[id] || 0}</Td>
                <Td>
                  {!hideCart && (
                    <AddCart
                      num={cart[wrapType][materialType][id]}
                      balance={dailyMaterials[id]}
                      handleClickPlus={() => addCart(id)}
                      handleClickMinus={() => removeCart(id)}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </>
        ) : (
          <>
            {craftMaterialList.map((name, id) => (
              <Tr key={id} h="12" bgColor="blackAlpha.600">
                <Td>{name}</Td>
                <Td>{craftMaterials[id] || 0}</Td>
                <Td>
                  {!hideCart && (
                    <AddCart
                      num={cart[wrapType][materialType][id]}
                      balance={craftMaterials[id]}
                      handleClickPlus={() => addCart(id)}
                      handleClickMinus={() => removeCart(id)}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </>
        )}
      </Tbody>
    </Table>
  );
};

export default Inventry;
