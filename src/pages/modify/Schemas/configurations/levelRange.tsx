import { api } from "~/utils/api";

async function fetchData() {
  try {
    const levelsData = await api.parameters.getCurrentLevel.useQuery();

    if (levelsData.isFetched && levelsData.data) {
      const levels = levelsData.data.map((ld) => ld.level);

      return {
        type: {
          type: "enum",
          options: ["勞保", "健保", "勞災"],
        },
        level_start: {
          type: "enum",
          options: levels,
        },
        level_end: {
          type: "number",
        },
      };
    } else {
      // If data is not yet fetched or is undefined, wait for a short time and then retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchData();
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    // If an error occurs during the fetch, wait for a short time and then retry
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return fetchData();
  }
}

export async function levelRangeConfig() {
  return await fetchData();
}
