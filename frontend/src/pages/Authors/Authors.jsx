import React from 'react';
import { Navigate } from 'react-router-dom';

// Հին «Հեղինակներ» ցանկի էջը այժմ միացված է /quotes-ի հետ (հեղինակների
// բոքսերի ցանցը հենց այնտեղ է ցուցադրվում), այնպես որ այս route-ը
// պարզապես ուղղորդում է դեպի այնտեղ՝ հին լինքերը/էջանիշերը չկոտրելու համար
const Authors = () => <Navigate to="/quotes" replace />;

export default Authors;