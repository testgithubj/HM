// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, TextField, InputAdornment, Paper } from '@mui/material';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// const ClockDurationPicker = ( { label, onChange, value, maxHours = 23, maxMinutes = 59 } ) => {
//     // Initialize with provided value or defaults
//     const [ hours, setHours ] = useState( value?.hours || 0 );
//     const [ minutes, setMinutes ] = useState( value?.minutes || 0 );
//     const [ activeSelector, setActiveSelector ] = useState( null ); // 'hours' or 'minutes'

//     // Handle value updates from parent
//     useEffect( () => {
//         if ( value ) {
//             setHours( value.hours || 0 );
//             setMinutes( value.minutes || 0 );
//         }
//     }, [ value ] );

//     // Update the value when hours or minutes change
//     const updateValue = ( newHours, newMinutes ) => {
//         // Ensure values are within valid range
//         newHours = Math.max( 0, Math.min( maxHours, newHours ) );
//         newMinutes = Math.max( 0, Math.min( maxMinutes, newMinutes ) );

//         setHours( newHours );
//         setMinutes( newMinutes );

//         if ( onChange ) {
//             onChange( { hours: newHours, minutes: newMinutes } );
//         }
//     };

//     // Handle increment/decrement for hours and minutes
//     const handleIncrement = ( type ) => {
//         if ( type === 'hours' ) {
//             updateValue( hours >= maxHours ? 0 : hours + 1, minutes );
//         } else {
//             updateValue( hours, minutes >= maxMinutes ? 0 : minutes + 1 );
//         }
//     };

//     const handleDecrement = ( type ) => {
//         if ( type === 'hours' ) {
//             updateValue( hours <= 0 ? maxHours : hours - 1, minutes );
//         } else {
//             updateValue( hours, minutes <= 0 ? maxMinutes : minutes - 1 );
//         }
//     };

//     // Handle direct input
//     const handleInputChange = ( event, type ) => {
//         const value = parseInt( event.target.value, 10 );

//         if ( isNaN( value ) ) {
//             if ( type === 'hours' ) {
//                 updateValue( 0, minutes );
//             } else {
//                 updateValue( hours, 0 );
//             }
//             return;
//         }

//         if ( type === 'hours' ) {
//             updateValue( Math.min( value, maxHours ), minutes );
//         } else {
//             updateValue( hours, Math.min( value, maxMinutes ) );
//         }
//     };

//     // Format numbers to always have two digits
//     const formatNumber = ( num ) => {
//         return num.toString().padStart( 2, '0' );
//     };

//     // Handle keyboard navigation
//     const handleKeyDown = ( event, type ) => {
//         if ( event.key === 'ArrowUp' ) {
//             handleIncrement( type );
//             event.preventDefault();
//         } else if ( event.key === 'ArrowDown' ) {
//             handleDecrement( type );
//             event.preventDefault();
//         }
//     };

//     return (
//         <Box sx={ { width: '100%', my: 1 } }>
//             { label && (
//                 <Typography variant="body1" sx={ { mb: 1, fontWeight: 500 } }>
//                     { label }
//                 </Typography>
//             ) }

//             <Paper
//                 elevation={ 1 }
//                 sx={ {
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 2,
//                     borderRadius: 1,
//                     bgcolor: 'background.paper',
//                     width: '100%'
//                 } }
//             >
//                 {/* Hours Section */ }
//                 <Box
//                     component="div"
//                     role="group"
//                     aria-label="Hours selector"
//                     sx={ {
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         width: '100px',
//                         bgcolor: activeSelector === 'hours' ? 'action.hover' : 'transparent',
//                         borderRadius: 1,
//                         mx: 1
//                     } }
//                 >
//                     <IconButton
//                         size="small"
//                         onClick={ () => handleIncrement( 'hours' ) }
//                         aria-label="Increase hours"
//                     >
//                         <KeyboardArrowUpIcon />
//                     </IconButton>

//                     <TextField
//                         value={ formatNumber( hours ) }
//                         onChange={ ( e ) => handleInputChange( e, 'hours' ) }
//                         onFocus={ () => setActiveSelector( 'hours' ) }
//                         onKeyDown={ ( e ) => handleKeyDown( e, 'hours' ) }
//                         inputProps={ {
//                             maxLength: 2,
//                             style: {
//                                 textAlign: 'center',
//                                 fontSize: '1.25rem',
//                                 fontWeight: 'bold',
//                                 padding: '4px'
//                             },
//                             'aria-label': 'Hours',
//                         } }
//                         variant="standard"
//                         sx={ {
//                             width: '65px',
//                             '& .MuiInput-underline:before': { borderBottom: 'none' },
//                             '& .MuiInput-underline:after': { borderBottom: 'none' },
//                             '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
//                         } }
//                         InputProps={ {
//                             endAdornment: (
//                                 <InputAdornment position="end" sx={ { ml: 0.5, minWidth: '20px' } }>
//                                     <Typography variant="body2" color="text.secondary">h</Typography>
//                                 </InputAdornment>
//                             ),
//                         } }
//                     />

//                     <IconButton
//                         size="small"
//                         onClick={ () => handleDecrement( 'hours' ) }
//                         aria-label="Decrease hours"
//                     >
//                         <KeyboardArrowDownIcon />
//                     </IconButton>
//                 </Box>

//                 <Typography variant="h5" sx={ { fontWeight: 'bold', mx: 0.5 } }>:</Typography>

//                 {/* Minutes Section */ }
//                 <Box
//                     component="div"
//                     role="group"
//                     aria-label="Minutes selector"
//                     sx={ {
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         width: '100px',
//                         bgcolor: activeSelector === 'minutes' ? 'action.hover' : 'transparent',
//                         borderRadius: 1,
//                         mx: 1
//                     } }
//                 >
//                     <IconButton
//                         size="small"
//                         onClick={ () => handleIncrement( 'minutes' ) }
//                         aria-label="Increase minutes"
//                     >
//                         <KeyboardArrowUpIcon />
//                     </IconButton>

//                     <TextField
//                         value={ formatNumber( minutes ) }
//                         onChange={ ( e ) => handleInputChange( e, 'minutes' ) }
//                         onFocus={ () => setActiveSelector( 'minutes' ) }
//                         onKeyDown={ ( e ) => handleKeyDown( e, 'minutes' ) }
//                         inputProps={ {
//                             maxLength: 2,
//                             style: {
//                                 textAlign: 'center',
//                                 fontSize: '1.25rem',
//                                 fontWeight: 'bold',
//                                 padding: '4px'
//                             },
//                             'aria-label': 'Minutes',
//                         } }
//                         variant="standard"
//                         sx={ {
//                             width: '65px',
//                             '& .MuiInput-underline:before': { borderBottom: 'none' },
//                             '& .MuiInput-underline:after': { borderBottom: 'none' },
//                             '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
//                         } }
//                         InputProps={ {
//                             endAdornment: (
//                                 <InputAdornment position="end" sx={ { ml: 0.5, minWidth: '20px' } }>
//                                     <Typography variant="body2" color="text.secondary">m</Typography>
//                                 </InputAdornment>
//                             ),
//                         } }
//                     />

//                     <IconButton
//                         size="small"
//                         onClick={ () => handleDecrement( 'minutes' ) }
//                         aria-label="Decrease minutes"
//                     >
//                         <KeyboardArrowDownIcon />
//                     </IconButton>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default ClockDurationPicker;

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment, Paper } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ClockDurationPicker = ( { label, onChange, value, maxHours = 23, maxMinutes = 59 } ) => {
    // Initialize with provided value or defaults
    const [ hours, setHours ] = useState( value?.hours || 0 );
    const [ minutes, setMinutes ] = useState( value?.minutes || 0 );
    const [ activeSelector, setActiveSelector ] = useState( null ); // 'hours' or 'minutes'

    // Add temporary input states to handle intermediate values during typing
    const [ hoursInput, setHoursInput ] = useState( formatNumber( value?.hours || 0 ) );
    const [ minutesInput, setMinutesInput ] = useState( formatNumber( value?.minutes || 0 ) );

    // Handle value updates from parent
    useEffect( () => {
        if ( value ) {
            setHours( value.hours || 0 );
            setMinutes( value.minutes || 0 );
            setHoursInput( formatNumber( value.hours || 0 ) );
            setMinutesInput( formatNumber( value.minutes || 0 ) );
        }
    }, [ value ] );

    // Format numbers to always have two digits
    function formatNumber ( num ) {
        return num.toString().padStart( 2, '0' );
    }

    // Update the value when hours or minutes change
    const updateValue = ( newHours, newMinutes ) => {
        // Ensure values are within valid range
        newHours = Math.max( 0, Math.min( maxHours, newHours ) );
        newMinutes = Math.max( 0, Math.min( maxMinutes, newMinutes ) );

        setHours( newHours );
        setMinutes( newMinutes );
        setHoursInput( formatNumber( newHours ) );
        setMinutesInput( formatNumber( newMinutes ) );

        if ( onChange ) {
            onChange( { hours: newHours, minutes: newMinutes } );
        }
    };

    // Handle increment/decrement for hours and minutes
    const handleIncrement = ( type ) => {
        if ( type === 'hours' ) {
            updateValue( hours >= maxHours ? 0 : hours + 1, minutes );
        } else {
            updateValue( hours, minutes >= maxMinutes ? 0 : minutes + 1 );
        }
    };

    const handleDecrement = ( type ) => {
        if ( type === 'hours' ) {
            updateValue( hours <= 0 ? maxHours : hours - 1, minutes );
        } else {
            updateValue( hours, minutes <= 0 ? maxMinutes : minutes - 1 );
        }
    };

    // Handle direct input during typing
    const handleInputChange = ( event, type ) => {
        const inputValue = event.target.value;

        // Allow empty inputs during typing and store the intermediate value
        if ( type === 'hours' ) {
            setHoursInput( inputValue );
        } else {
            setMinutesInput( inputValue );
        }
    };

    // Handle when input field loses focus - validate and update the value
    const handleInputBlur = ( type ) => {
        setActiveSelector( null );

        if ( type === 'hours' ) {
            const parsedValue = parseInt( hoursInput, 10 );
            // If invalid, revert to previous valid value
            if ( isNaN( parsedValue ) ) {
                setHoursInput( formatNumber( hours ) );
            } else {
                // Apply the valid value
                updateValue( Math.min( parsedValue, maxHours ), minutes );
            }
        } else {
            const parsedValue = parseInt( minutesInput, 10 );
            // If invalid, revert to previous valid value
            if ( isNaN( parsedValue ) ) {
                setMinutesInput( formatNumber( minutes ) );
            } else {
                // Apply the valid value
                updateValue( hours, Math.min( parsedValue, maxMinutes ) );
            }
        }
    };

    // Handle when Enter key is pressed - apply the value immediately
    const handleKeyDown = ( event, type ) => {
        if ( event.key === 'Enter' ) {
            handleInputBlur( type );
        } else if ( event.key === 'ArrowUp' ) {
            handleIncrement( type );
            event.preventDefault();
        } else if ( event.key === 'ArrowDown' ) {
            handleDecrement( type );
            event.preventDefault();
        }
    };

    return (
        <Box sx={ { width: '100%', my: 1 } }>
            { label && (
                <Typography variant="body1" sx={ { mb: 1, fontWeight: 500 } }>
                    { label }
                </Typography>
            ) }

            <Paper
                elevation={ 1 }
                sx={ {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    width: '100%'
                } }
            >
                {/* Hours Section */ }
                <Box
                    component="div"
                    role="group"
                    aria-label="Hours selector"
                    sx={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100px',
                        bgcolor: activeSelector === 'hours' ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        mx: 1
                    } }
                >
                    <IconButton
                        size="small"
                        onClick={ () => handleIncrement( 'hours' ) }
                        aria-label="Increase hours"
                    >
                        <KeyboardArrowUpIcon />
                    </IconButton>

                    <TextField
                        value={ hoursInput }
                        onChange={ ( e ) => handleInputChange( e, 'hours' ) }
                        onFocus={ () => setActiveSelector( 'hours' ) }
                        onBlur={ () => handleInputBlur( 'hours' ) }
                        onKeyDown={ ( e ) => handleKeyDown( e, 'hours' ) }
                        inputProps={ {
                            maxLength: 2,
                            style: {
                                textAlign: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                padding: '4px'
                            },
                            'aria-label': 'Hours',
                        } }
                        variant="standard"
                        sx={ {
                            width: '65px',
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        } }
                        InputProps={ {
                            endAdornment: (
                                <InputAdornment position="end" sx={ { ml: 0.5, minWidth: '20px' } }>
                                    <Typography variant="body2" color="text.secondary">h</Typography>
                                </InputAdornment>
                            ),
                        } }
                    />

                    <IconButton
                        size="small"
                        onClick={ () => handleDecrement( 'hours' ) }
                        aria-label="Decrease hours"
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Box>

                <Typography variant="h5" sx={ { fontWeight: 'bold', mx: 0.5 } }>:</Typography>

                {/* Minutes Section */ }
                <Box
                    component="div"
                    role="group"
                    aria-label="Minutes selector"
                    sx={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100px',
                        bgcolor: activeSelector === 'minutes' ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        mx: 1
                    } }
                >
                    <IconButton
                        size="small"
                        onClick={ () => handleIncrement( 'minutes' ) }
                        aria-label="Increase minutes"
                    >
                        <KeyboardArrowUpIcon />
                    </IconButton>

                    <TextField
                        value={ minutesInput }
                        onChange={ ( e ) => handleInputChange( e, 'minutes' ) }
                        onFocus={ () => setActiveSelector( 'minutes' ) }
                        onBlur={ () => handleInputBlur( 'minutes' ) }
                        onKeyDown={ ( e ) => handleKeyDown( e, 'minutes' ) }
                        inputProps={ {
                            maxLength: 2,
                            style: {
                                textAlign: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                padding: '4px'
                            },
                            'aria-label': 'Minutes',
                        } }
                        variant="standard"
                        sx={ {
                            width: '65px',
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        } }
                        InputProps={ {
                            endAdornment: (
                                <InputAdornment position="end" sx={ { ml: 0.5, minWidth: '20px' } }>
                                    <Typography variant="body2" color="text.secondary">m</Typography>
                                </InputAdornment>
                            ),
                        } }
                    />

                    <IconButton
                        size="small"
                        onClick={ () => handleDecrement( 'minutes' ) }
                        aria-label="Decrease minutes"
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default ClockDurationPicker;