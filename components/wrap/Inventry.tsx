import { FC } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "~/components/common";
import { craftMaterialList, dailyMaterialList } from "~/types";

const Inventry: FC<{ dailyMaterials: number[]; craftMaterials: number[] }> = ({ dailyMaterials, craftMaterials }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Ammount</Th>
        </Tr>
      </Thead>
      <Tbody>
        {dailyMaterialList.map((name, i) => (
          <Tr key={`${i}`}>
            <Td>{name}</Td>
            <Td>{dailyMaterials[i] || 0}</Td>
          </Tr>
        ))}
        {craftMaterialList.map((name, i) => (
          <Tr key={i}>
            <Td>{name}</Td>
            <Td>{craftMaterials[i] || 0}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Inventry;
