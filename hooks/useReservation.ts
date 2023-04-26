import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    setDidBook,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setDidBook(true);
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
      //   console.log(error);
    }
  };
  return { loading, error, createReservation };
}
